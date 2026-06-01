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
          DEFAULT: '#0a0a0a',
          50: '#141414',
          100: '#1a1a1a',
          200: '#222222',
          300: '#2a2a2a',
          400: '#333333',
          500: '#444444',
          600: '#666666',
          700: '#888888',
          800: '#aaaaaa',
          900: '#cccccc',
        },
        neon: {
          gold: '#FFD700',
          'gold-dim': '#B8960C',
          amber: '#FFBF00',
        },
        emerald: {
          glow: '#00E676',
          muted: '#2E7D32',
        },
        rose: {
          gold: '#B76E79',
          light: '#F4C2C2',
          blush: '#FFF0F0',
        },
        plum: {
          DEFAULT: '#4A1942',
          deep: '#2D1035',
          light: '#6B3A6B',
        },
        champagne: {
          DEFAULT: '#F7E7CE',
          light: '#FDF5E6',
          dark: '#D4A574',
        },
        cream: '#0a0a0a',
        gold: {
          DEFAULT: '#FFD700',
          light: '#FFE44D',
          dark: '#B8960C',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'Outfit', 'Inter', 'system-ui', 'serif'],
        heading: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Space Grotesk', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'slide-in-right': 'slideInRight 0.4s ease-out forwards',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
        'typewriter': 'typewriter 3s steps(40) forwards',
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
        'scale-up': 'scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'silk-wave': 'silkWave 12s ease-in-out infinite',
        'silk-wave-2': 'silkWave2 15s ease-in-out infinite',
        'grain': 'grain 8s steps(10) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255,215,0,0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(255,215,0,0.5)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.2)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        scaleUp: {
          '0%': { opacity: '0', transform: 'scale(0.9) translateY(10px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        silkWave: {
          '0%': { transform: 'translateX(-30%) translateY(-10%) rotate(-3deg) scaleY(1)' },
          '25%': { transform: 'translateX(-10%) translateY(5%) rotate(1deg) scaleY(1.05)' },
          '50%': { transform: 'translateX(10%) translateY(-5%) rotate(3deg) scaleY(0.95)' },
          '75%': { transform: 'translateX(-5%) translateY(8%) rotate(-1deg) scaleY(1.02)' },
          '100%': { transform: 'translateX(-30%) translateY(-10%) rotate(-3deg) scaleY(1)' },
        },
        silkWave2: {
          '0%': { transform: 'translateX(20%) translateY(10%) rotate(2deg) scaleY(1)' },
          '25%': { transform: 'translateX(5%) translateY(-8%) rotate(-2deg) scaleY(1.03)' },
          '50%': { transform: 'translateX(-15%) translateY(5%) rotate(-3deg) scaleY(0.97)' },
          '75%': { transform: 'translateX(10%) translateY(-3%) rotate(1deg) scaleY(1.04)' },
          '100%': { transform: 'translateX(20%) translateY(10%) rotate(2deg) scaleY(1)' },
        },
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-5%, -10%)' },
          '20%': { transform: 'translate(-15%, 5%)' },
          '30%': { transform: 'translate(7%, -25%)' },
          '40%': { transform: 'translate(-5%, 25%)' },
          '50%': { transform: 'translate(-15%, 10%)' },
          '60%': { transform: 'translate(15%, 0%)' },
          '70%': { transform: 'translate(0%, 15%)' },
          '80%': { transform: 'translate(3%, 35%)' },
          '90%': { transform: 'translate(-10%, 10%)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #0a0a0a 0%, #141414 30%, #1a1a1a 70%, #0a0a0a 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,215,0,0.03) 0%, rgba(0,230,118,0.05) 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow': '0 0 30px rgba(255,215,0,0.15)',
        'glow-lg': '0 0 60px rgba(255,215,0,0.25)',
        'glow-emerald': '0 0 30px rgba(0,230,118,0.15)',
        'card': '0 4px 20px rgba(0,0,0,0.3)',
        'card-hover': '0 8px 40px rgba(255,215,0,0.1)',
      },
    },
  },
  plugins: [],
};
