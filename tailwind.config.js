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
      blue: colors.blue,
      primary: {
        DEFAULT: '#18cbdb',
        dark: '#128a7a'
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
        xxl: '3.75rem',
        xl: '3rem',
        lg: '2.25rem',
        md: '1.875rem',
        sm: '1.5rem',
        xs: '1.125rem',
        xxs: '0.75rem'
      },
      maxWidth: {
        '8xl': '1920px'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
