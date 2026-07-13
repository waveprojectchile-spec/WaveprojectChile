import type { Config } from 'tailwindcss';

/**
 * SISTEMA DE DISEÑO — WAVE PROJECT GYM
 * Monocromático fiel al logo (blanco / negro).
 * El acento vive en la variable CSS --accent (globals.css).
 * Cambiar esa variable = reskin de todo el sitio en 1 línea.
 */
const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        /* Superficies (negro → gris) */
        ink: {
          950: '#050505', // fondo base
          900: '#0A0A0A', // fondo alterno
          800: '#111111', // cards
          700: '#1A1A1A', // card hover / tracks
          600: '#242424', // bordes fuertes
        },
        /* Texto (blanco → gris, todos AA sobre negro) */
        chalk: {
          DEFAULT: '#FFFFFF', // texto primario
          muted:   '#B4B4B4', // secundario  (contraste 8.9:1 ✓)
          faint:   '#8A8A8A', // terciario   (contraste 5.0:1 ✓ AA)
          ghost:   '#5E5E5E', // solo decorativo, nunca texto informativo
        },
        /* Acento semántico — se resuelve desde la variable CSS */
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          soft:    'rgb(var(--accent) / 0.12)',
          line:    'rgb(var(--accent) / 0.30)',
        },
        /* Líneas / bordes */
        hair: 'rgb(255 255 255 / 0.08)',
      },
      fontFamily: {
        display: ['Bebas Neue', 'Oswald', 'sans-serif'],
        heading: ['Barlow Condensed', 'Montserrat', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
      },
      boxShadow: {
        accent:    '0 0 24px rgb(var(--accent) / 0.25)',
        'accent-lg': '0 0 48px rgb(var(--accent) / 0.35)',
        card:      '0 8px 40px rgb(0 0 0 / 0.55)',
      },
      animation: {
        float:        'float 6s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
        'pulse-ring': 'pulseRing 2s ease-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseRing: {
          '0%':   { transform: 'scale(1)',   opacity: '0.6' },
          '100%': { transform: 'scale(1.8)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
