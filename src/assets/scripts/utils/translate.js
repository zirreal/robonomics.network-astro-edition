// for easier translate function
import * as m from '../../../paraglide/messages'; 

const turnStringToTranslationKey = (string) => {
  return string
    .normalize("NFD") // Normalize accents (e.g., é → e)
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-zA-Z0-9_]/g, "_") // Replace all non-alphanumeric characters with _
    .replace(/^(\d)/, "_$1"); // Prefix with _ if it starts with a number
}

function translate(value) {
  const key = turnStringToTranslationKey(value);
  return m[key] ? m[key]() : 'Translation not found';  // Prevent 
}

globalThis.$tr = translate;

export {translate}