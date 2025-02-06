// @ts-check
import { defineConfig } from 'astro/config';
import AutoImport from 'astro-auto-import';
import mdx from '@astrojs/mdx';
import vue from '@astrojs/vue';

export default defineConfig({
  markdown: {
    syntaxHighlight: 'prism',
    gfm: true,
  },
  integrations: [AutoImport({
    imports: [
      '/src/components/RbButton.astro',
      '/src/components/RbImage.astro',
      '/src/components/RbCode.astro',
      '/src/components/RbGridWrapper.astro',
      '/src/components/RbGridElement.astro',
      '/src/components/TextCard.astro',
      '/src/components/post/PostCard.astro',
      '/src/components/post/PostExpiredInfo.astro',
      {
        // import { Tweet, YouTube } from 'astro-embed';
        'astro-embed': ['Tweet', 'YouTube']
      }
    ],
  }), // Make sure the MDX integration is included AFTER astro-auto-import
  mdx(), vue()],
});