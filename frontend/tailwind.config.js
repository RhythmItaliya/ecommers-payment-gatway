module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    fontFamily: {
      sans: ['League Spartan', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      primary: ['League Spartan', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      body: ['League Spartan', 'ui-sans-serif', 'system-ui', 'sans-serif'],
    },
    container: {
      padding: {
        DEFAULT: '30px',
        lg: '0',
      },
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1440px',
    },
    extend: {
      colors: {
        primary: '#222222',
        secondary: '#F5E6E0',
        'custom-gray': '#2f2f2f',
      },
      backgroundImage: {
        hero: "url('./img/bghero.jpg')",
      },
      fontFamily: {
        spartan: ['League Spartan', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
