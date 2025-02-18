/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // Ensure the correct path
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
