import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F7F3EC',
        surface: '#FFFCF7',
        muted: '#EDE5D9',
        ink: '#27231F',
        secondary: '#85786D',
        brand: '#80543C',
        'brand-hover': '#6A432F',
        accent: '#A85D45',
        line: '#DED5C8',
        success: '#65765D',
        gold: '#B08A54',
        clay: {
          deep: '#4B2F22',
          zini: '#5A3B2C',
          zhuni: '#8A3E2C',
          duanni: '#C1A273',
        },
      },
      fontFamily: {
        serif: [
          '"Noto Serif SC"',
          '"Source Han Serif SC"',
          '"Songti SC"',
          'STSong',
          'SimSun',
          'serif',
        ],
        sans: [
          '"Noto Sans SC"',
          '"Source Han Sans SC"',
          '"PingFang SC"',
          '"Microsoft YaHei"',
          'system-ui',
          'sans-serif',
        ],
        kai: ['KaiTi', 'STKaiti', '"Kaiti SC"', '"Noto Serif SC"', 'SimSun', 'serif'],
      },
      boxShadow: {
        soft: '0 18px 50px -28px rgba(62, 43, 31, 0.38)',
        lift: '0 24px 70px -34px rgba(62, 43, 31, 0.5)',
        insetline: 'inset 0 0 0 1px rgba(222, 213, 200, 0.75)',
      },
      borderRadius: {
        '2.5xl': '20px',
      },
      transitionTimingFunction: {
        silk: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 700ms cubic-bezier(0.22, 1, 0.36, 1) both',
        float: 'float 7s ease-in-out infinite',
        shimmer: 'shimmer 2.4s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
