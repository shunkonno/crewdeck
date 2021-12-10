const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors:{
      transparent: 'transparent',
      current: 'currentColor',
      white: colors.white,
      black: colors.black,
      slate: colors.slate,
      red: colors.red,
      yellow: colors.yellow,
      teal: colors.teal,
      blue: colors.blue,
      primary:{
        default: '#1bebcf',
        dark: '#128a7a'
      },
      secondary:{
        default: "#f7825c",
        dark: "#bf5b39"
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
        '"Noto Color Emoji"',
      ],
    },
    extend: {
      spacing: {
        xxl: '3.75rem',
        xl: '3rem',
        lg: '2.25rem',
        md: '1.875rem',
        sm: '1.5rem',
        xs: '1.125rem',
        xxs: '0.75rem',
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
