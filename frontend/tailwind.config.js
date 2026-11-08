/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Acción primaria: ámbar/naranja (marca Tu Coperacha)
        brand: {
          50: '#FFF8EC',
          100: '#FEEBC4',
          200: '#FCD78A',
          300: '#FBC45A',
          400: '#FBAE2E',
          500: '#F3960C',
          600: '#EB6C01',
          700: '#C85A00',
          800: '#9A4300',
          900: '#6B2F00',
        },
        navy: {
          50: '#EEF3F6',
          100: '#D6E0E6',
          200: '#AEC0CA',
          300: '#7F96A3',
          400: '#536B78',
          500: '#374E59',
          600: '#283C47',
          700: '#22333D',
          800: '#1E323D',
          900: '#152128',
        },
        sky: {
          50: '#F1FAFE',
          100: '#DDF4FC',
          200: '#BEE9F8',
          300: '#90DCF4',
          400: '#5EC6E8',
          500: '#0F8AD4',
        },
        gold: {
          400: '#FFD93D',
          500: '#FBCE07',
          600: '#D9B000',
        },
        ink: {
          900: '#1E323D',
          600: '#4F6470',
          300: '#AEC0CA',
        },
      },
      fontFamily: {
        display: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        tactile: '0 2px 0 #C97800',
        'tactile-sm': '0 1px 0 #C97800',
      },
      keyframes: {
        coinDrop: {
          '0%': { transform: 'translateY(-120px) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '1' },
          '70%': { transform: 'translateY(0) rotate(360deg)', opacity: '1' },
          '85%': { transform: 'translateY(-12px) rotate(380deg)' },
          '100%': { transform: 'translateY(0) rotate(400deg)', opacity: '1' },
        },
        coinSpin: {
          '0%, 100%': { transform: 'rotateY(0deg)' },
          '50%': { transform: 'rotateY(180deg)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        coinDrop: 'coinDrop 2.4s ease-in-out infinite',
        coinSpin: 'coinSpin 3s ease-in-out infinite',
        sparkle: 'sparkle 1.8s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
        fadeInUp: 'fadeInUp 0.5s ease-out',
      },
    },
  },
  plugins: [],
};
