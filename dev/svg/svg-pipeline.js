// === SVG Pipeline Script with ID Preservation ===
//
// Этот скрипт обрабатывает SVG-файлы в несколько этапов:
// 1. Заменяет <use xlink:href="#id"> на <image> из <defs>.
// 2. Сохраняет все id элементов <g>:
//    – для каждого <g> с id, копирует его в data-preserve-id и удаляет id.
// 3. Оптимизирует SVG через SVGO v3 с нужными плагинами.
// 4. После оптимизации, восстанавливает id из data-preserve-id.
// 5. Сохраняет результат в output/.
//
// Требуется: cheerio, svgo
// Структура: файлы из input/ обрабатываются и сохраняются в output/
//
// Запуск:
//   node svg-pipeline.js

import fs from 'fs';
import path from 'path';
import { optimize } from 'svgo';
import * as cheerio from 'cheerio';

// === 1. Конфигурация директорий ===
const inputDir = path.resolve('input');
const outputDir = path.resolve('output');
fs.mkdirSync(outputDir, { recursive: true });

// Обходим все SVG-файлы в папке input/
fs.readdirSync(inputDir).forEach((file) => {
  if (!file.endsWith('.svg')) return;

  const inputPath = path.join(inputDir, file);
  const rawSvg = fs.readFileSync(inputPath, 'utf8');

  // === 2. Предобработка SVG с помощью Cheerio ===
  // Заменяем <use> на <image> и сохраняем id элементов, скрывая их
  const $ = cheerio.load(rawSvg, { xmlMode: true });

  // Сохраняем id: для каждого <g> с id, копируем id в data-preserve-id и удаляем id
  $('g').each((_, g) => {
    const $g = $(g);
    if ($g.attr('id')) {
      $g.attr('data-preserve-id', $g.attr('id'));
      $g.removeAttr('id');
    }
  });

  // Замена <use> на <image>
  const defs = $('defs');
  $('g').each((_, g) => {
    const $g = $(g);
    const $use = $g.find('use');
    if (!$use.length) return;
    
    const href = $use.attr('xlink:href') || $use.attr('href');
    if (!href || !href.startsWith('#')) return;
    
    const refId = href.slice(1);
    const ref = defs.find(`#${refId}`);
    if (!ref.length || ref[0].tagName !== 'image') return;
    
    // Клонируем содержимое <image> из <defs>
    const $image = $('<image>');
    for (const [key, val] of Object.entries(ref[0].attribs)) {
      $image.attr(key, val);
    }
    // Копируем координаты и размеры из <use>
    ['x', 'y', 'width', 'height'].forEach((attr) => {
      if ($use.attr(attr)) {
        $image.attr(attr, $use.attr(attr));
      }
    });
    $use.replaceWith($image);
  });

  const patchedSvg = $.xml();

  // === 3. Оптимизация через SVGO ===
  let result;
  try {
    result = optimize(patchedSvg, {
      path: inputPath,
      multipass: true,
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              removeViewBox: false,
              removeUselessDefs: false,
              removeUnusedNS: false
              // cleanupIDs не отключаем явно – мы восстановим id вручную
            }
          }
        },
        'removeDimensions',
        {
          name: 'removeAttrs',
          params: {
            attrs: ['class', 'data-name']
          }
        }
      ]
    });
  } catch (err) {
    console.error(`❌ Ошибка при оптимизации ${file}:`, err);
    return;
  }
  
  if (!result || !result.data) {
    console.warn(`⚠️ Не удалось оптимизировать файл ${file}`);
    return;
  }

  // === 4. Пост-обработка: восстановление id ===
  // Парсим оптимизированный SVG и восстанавливаем id из data-preserve-id
  const $opt = cheerio.load(result.data, { xmlMode: true });
  $opt('g').each((_, g) => {
    const $g = $opt(g);
    const preserved = $g.attr('data-preserve-id');
    if (preserved) {
      $g.attr('id', preserved);
      $g.removeAttr('data-preserve-id');
    }
  });

  const finalSvg = $opt.xml();

  // === 5. Сохраняем итоговый SVG в output/ ===
  const outPath = path.join(outputDir, file);
  fs.writeFileSync(outPath, finalSvg, 'utf8');
  console.log(`✅ Optimized and patched: ${file}`);
});
