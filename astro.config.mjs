// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkNeurologyImages from './src/plugins/remark-neurology-images.mjs';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  // sitemap と canonical に要る。向け替え先のドメインを入れてある。
  site: 'https://www.tonkura.blog',
  integrations: [mdx(), react(), sitemap()],
  markdown: {
    remarkPlugins: [remarkNeurologyImages],
  },
});