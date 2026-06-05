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
        'fade-in': 'fadeIn 0.25s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.25s ease-out forwards',
        'word-reveal': 'wordReveal 0.25s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'sparkle': 'sparkle 3s ease-in-out infinite',
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
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
        float: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-20px) scale(1.05)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0.2', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.5', boxShadow: '0 0 5px currentColor' },
          '50%': { opacity: '1', boxShadow: '0 0 20px currentColor' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      boxShadow: {
        'glow': '0 0 30px rgba(212,169,106,0.15), 0 0 60px rgba(212,169,106,0.08)',
        'glow-lg': '0 0 60px rgba(212,169,106,0.15)',
        'card': '0 2px 12px rgba(0,0,0,0.3)',
        'card-hover': '0 6px 24px rgba(212,169,106,0.08)',
      },
    },
  },
  plugins: [],
};
