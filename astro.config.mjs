// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import icon from "astro-icon";
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://hadiwijayaborepile.co.id/',
  integrations: [
    sitemap(),
    icon()
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});
