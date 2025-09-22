// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import icon from "astro-icon";
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://hadiwijayaborepile.co.id/',
  integrations: [
    sitemap(),
    icon(),
    tailwind()
  ]
});