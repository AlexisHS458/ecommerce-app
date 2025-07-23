module.exports = {
  content: ['./src/**/*.{html,ts}', './node_modules/primeng/**/*.{js,ts}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0D6EFD', // Azul ecommerce
          dark: '#0A58CA',
          light: '#E7F1FF',
        },
        gray: {
          100: '#f5f5f5',
          200: '#eeeeee',
          300: '#e0e0e0',
          400: '#bdbdbd',
          500: '#9e9e9e',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
        },
        accent: '#FFB800', // Amarillo para detalles de compra
        danger: '#DC3545',
        success: '#198754',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.75rem',
      },
      boxShadow: {
        card: '0 4px 10px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};
