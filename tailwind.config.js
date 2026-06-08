/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        space: {
          900: '#020817',
          800: '#0D1117',
          700: '#161B22',
          600: '#21262D',
          500: '#30363D',
        },
        primary: '#58A6FF',
        success: '#3FB950',
        warning: '#D29922',
        danger: '#F85149',
        purple: '#BC8CFF',
        cyan: '#79C0FF',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'flow': 'flowGradient 3s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'typewriter': 'typewriter 0.5s steps(1) infinite',
        'count-up': 'countUp 1s ease-out forwards',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(88,166,255,0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(88,166,255,0.6), 0 0 40px rgba(88,166,255,0.2)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        flowGradient: {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '0% 200%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        typewriter: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};
