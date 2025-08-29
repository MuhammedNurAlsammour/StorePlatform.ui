module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--custom-color-primary)',
          text: 'var(--custom-color-text)'
        },
        accent: {
          DEFAULT: 'var(--custom-color-accent)'
        }
      }
    }
  },
  plugins: []
};