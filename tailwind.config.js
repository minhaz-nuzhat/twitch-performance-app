/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'tp-black':   '#080808',
        'tp-surface': '#111111',
        'tp-card':    '#161616',
        'tp-raised':  '#1c1c1c',
        'tp-border':  '#252525',
        'tp-border-bright': '#333333',

        'tp-red':       '#e63946',
        'tp-red-bright':'#ff4757',
        'tp-red-dim':   '#c1121f',
        'tp-red-muted': 'rgba(230,57,70,0.12)',

        'tp-white':   '#ffffff',
        'tp-soft':    '#d0d0d0',
        'tp-muted':   '#8a8a8a',

        'tp-bronze': '#cd7f32',
        'tp-silver': '#c0c0c0',
        'tp-gold':   '#ffd700',
        'tp-elite':  '#b347ea',

        'tp-green':  '#22c55e',
        'tp-amber':  '#f59e0b',
        'tp-danger': '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      animation: {
        'fade-up':   'fadeUp 0.4s ease forwards',
        'fade-in':   'fadeIn 0.3s ease forwards',
        'pulse-red': 'pulseRed 2s ease-in-out infinite',
        'slide-in':  'slideIn 0.3s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: 0, transform: 'translateY(16px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: 0 },
          '100%': { opacity: 1 },
        },
        pulseRed: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(230,57,70,0)' },
          '50%':      { boxShadow: '0 0 0 6px rgba(230,57,70,0.15)' },
        },
        slideIn: {
          '0%':   { opacity: 0, transform: 'translateX(100%)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
