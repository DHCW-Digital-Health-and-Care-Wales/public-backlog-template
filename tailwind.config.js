/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // DHCW Design System V2 brand palette
        navy: '#1B294A',
        'dhcw-blue': '#12A3C9',
        'nhs-wales-blue': '#325083',
        yellow: '#F8CA4D',
        // UI roles
        heading: '#1B365D',
        action: '#005AA8',
        // Neutrals
        'ink-900': '#212B32',
        'ink-700': '#4C5862',
        'ink-500': '#768692',
        'ink-300': '#AEB7BD',
        surface: '#FFFFFF',
        'surface-subtle': '#F0F4F5',
        'surface-muted': '#E8EDF3',
        border: '#D8DDE0',
        'border-strong': '#B6C0CD',
      },
      fontFamily: {
        sans: [
          'Roboto',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      borderRadius: {
        card: '8px',
      },
      maxWidth: {
        content: '80rem',
      },
    },
  },
  plugins: [],
};
