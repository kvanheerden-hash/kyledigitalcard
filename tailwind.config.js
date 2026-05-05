/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg:              '#0A0B0F',
        surface:         '#12141A',
        'gold-bright':   '#E8C060',
        'gold-mid':      '#C9922A',
        'gold-deep':     '#8B5E1A',
        'gold':          '#C9A84C',
        'text-primary':  '#F0EDE8',
        'text-muted':    '#6B7280',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        sans:  ['"DM Sans"', 'sans-serif'],
      },
      fontSize: {
        'fluid-hero':  'clamp(2.2rem, 5vw, 4.8rem)',
        'fluid-title': 'clamp(0.7rem, 1.5vw, 1rem)',
        'fluid-body':  'clamp(0.8rem, 1vw, 0.9rem)',
      },
    }
  },
  plugins: [],
}
