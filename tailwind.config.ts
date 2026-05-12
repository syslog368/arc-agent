import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        arc: {
          50: '#eef7ff',
          100: '#d9ecff',
          500: '#2b87ff',
          600: '#1f67db',
          700: '#1d4fa8'
        }
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(59,130,246,.15), 0 10px 35px -5px rgba(30,64,175,.35)'
      }
    }
  },
  plugins: []
};

export default config;
