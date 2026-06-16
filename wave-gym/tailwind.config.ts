import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary':    '#0A0A0A',
        'bg-card':       '#111111',
        'bg-card-hover': '#1A1A1A',
        'gold-primary':  '#C9A84C',
        'gold-bright':   '#F5C842',
        'gold-dark':     '#8B6914',
        'white-muted':   '#A0A0A0',
        'border-card':   '#2A2A2A',
      },
      fontFamily: {
        display:  ['Bebas Neue', 'Oswald', 'sans-serif'],
        heading:  ['Montserrat', 'sans-serif'],
        body:     ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C9A84C, #F5C842)',
      },
      boxShadow: {
        'gold':       '0 0 20px rgba(201,168,76,0.4)',
        'gold-sm':    '0 0 10px rgba(201,168,76,0.2)',
        'gold-lg':    '0 0 40px rgba(201,168,76,0.6)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(201,168,76,0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(201,168,76,0.8)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
