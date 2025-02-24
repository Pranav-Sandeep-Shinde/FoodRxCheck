/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // Ensure the correct path
  safelist: [
    { pattern: /^bg-(teal|sky)-(100|200|300|400|500|600|700|800|900)$/ }, // Background colors
    { pattern: /^hover:bg-(teal|sky)-(600|700)$/ }, // Hover backgrounds
    { pattern: /^text-(teal|sky)-(600|700)$/ }, // Text colors
    { pattern: /^border-(teal|sky)-(600|700)$/ }, // Border colors
  ],
  theme: {
    extend: {
      keyframes: {
        'roll': {
          '0%': { transform: 'translateX(100%)', opacity: 0 },
          '15%': { transform: 'translateX(0)', opacity: 1 },
          '85%': { transform: 'translateX(0)', opacity: 1 },
          '100%': { transform: 'translateX(-100%)', opacity: 0 },
        }
      },
      animation: {
        'roll': 'roll 8s linear infinite',
      }
    },
  },
  plugins: [],
};
