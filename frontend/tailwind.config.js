/** @type {import('tailwindcss').Config} */

import daisyui from 'daisyui'
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'md-lg': {'min': '768px', 'max': '1023px'}, // Custom range between md and lg
        'special': {'max': '599px'},
         'addFriend': {'max': '560px'}
      },

    },
  },
  plugins: [
    daisyui,  // Keep daisyUI plugin
    function ({ addComponents }) {
      addComponents({
        '.custom-fixed-bottom': {
          '@screen special': { // Applies styles when screen width is below 500px
            display: 'flex',
            position: 'fixed',
            bottom: '0',
            alignItems: 'center',
            left: '50%',
            transform: 'translateX(-50%)',
          },
          'special-small-screen': {
            '@screen special': { // Applies styles when screen width is below 500px
              width: '0%',
              height: '0vh'
            },
          }

        },
      })
    },
  ],
  daisyui: {
    themes: [
      "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
      "dim",
      "nord",
      "sunset",
    ],
  }
}

