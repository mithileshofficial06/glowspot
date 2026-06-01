/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        noir: {
          DEFAULT: '#080608',
          50: '#0e0c0e',
          100: '#141214',
          200: '#1a181a',
          300: '#222022',
          400: '#2e2c2e',
          500: '#3a383a',
          600: '#5a585a',
          700: '#7a787a',
          800: '#9a989a',
          900: '#bab8ba',
        },
        gold: {
          DEFAULT: '#D4A96A',
          light: '#E3C48F',
          dark: '#B08A4E',
          muted: '#A8895A',
        },
        mauve: {
          DEFAULT: '#9B6B8A',
          light: '#B48AA6',
          dark: '#7A5470',
          muted: '#6E4D63',
        },
        ivory: {
          DEFAULT: '#F2EDE8',
          dim: '#C8C3BE',
          muted: '#8A8580',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['Jost', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.7s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'word-reveal': 'wordReveal 0.6s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        wordReveal: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      boxShadow: {
        'glow': '0 0 30px rgba(212,169,106,0.1)',
        'glow-lg': '0 0 60px rgba(212,169,106,0.15)',
        'card': '0 2px 12px rgba(0,0,0,0.3)',
        'card-hover': '0 6px 24px rgba(212,169,106,0.08)',
      },
    },
  },
  plugins: [],
};
