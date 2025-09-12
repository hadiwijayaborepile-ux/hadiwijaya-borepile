import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'primary-color': '#FF6B00',
        'secondary-color': '#222A7A',
      },
    },
  },
  plugins: [
    typography,
  ],
}
