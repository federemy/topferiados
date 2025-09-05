// astro.config.mjs
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'server',
  site: 'https://topferiados.netlify.app', // ⚠️ poné tu URL final
  adapter: netlify(),
  integrations: [sitemap()],
});
