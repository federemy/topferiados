// astro.config.mjs
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

export default defineConfig({
  output: 'server',
  adapter: netlify(),
  // site: 'https://tu-sitio.netlify.app', // (opcional, útil para URLs absolutas)
});
