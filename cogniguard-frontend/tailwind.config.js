
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Sora"', 'sans-serif'],
        body:    ['"DM Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        cyber: {
          cyan:    '#00D4FF',
          green:   '#00FF87',
          amber:   '#FFB800',
          red:     '#FF3B5C',
          navy:    '#0A1628',
          steel:   '#0F2040',
          mid:     '#050A14',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
      }
    }
  },
  plugins: [],
}
