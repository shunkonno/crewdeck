const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: colors.white,
      black: colors.black,
      slate: colors.slate,
      red: colors.red,
      yellow: colors.yellow,
      teal: colors.teal,
      cyan: colors.cyan,
      blue: colors.blue,
      primary: {
        DEFAULT: '#00bdb6',
        dark: '#128a7a',
        hover: '#00b0a9'
      },
      secondary: {
        DEFAULT: '#f7825c',
        dark: '#bf5b39'
      }
    },
    fontFamily: {
      sans: [
        '"Inter"',
        'system-ui',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        '"Noto Sans"',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
        '"Noto Color Emoji"'
      ]
    },
    extend: {
      spacing: {
        '3xl': '4.50rem',
        '2xl': '3.75rem',
        xl: '3rem',
        lg: '2.25rem',
        md: '1.875rem',
        sm: '1.5rem',
        xs: '1.125rem',
        '2xs': '0.75rem'
      },
      maxWidth: {
        '8xl': '1920px'
      },
      lineHeight: {
        'extra-tight': '1.125'
      },
      boxShadow: {
        'around': '0 0 6px -1px rgb(0 0 0 / 0.1), 0 0 4px -2px rgb(0 0 0 / 0.1)'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
