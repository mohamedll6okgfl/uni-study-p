/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Brand ramp — Indigo
        brand: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          400: '#818cf8',
          500: '#6366f1',   // PRIMARY ACTION
          600: '#4f46e5',
          700: '#4338ca',
          900: '#312e81',
        },
        // Surface ramp — Slate
        surface: {
          50:  '#f8fafc',   // PAGE BG (light)
          100: '#f1f5f9',   // CARD BG (light)
          200: '#e2e8f0',   // BORDER (light)
          300: '#cbd5e1',   // MUTED BORDER
          400: '#94a3b8',   // PLACEHOLDER TEXT
          500: '#64748b',   // SECONDARY TEXT
          700: '#334155',   // CARD BG (dark)
          800: '#1e293b',   // PAGE BG (dark)
          900: '#0f172a',   // DEEP BG (dark)
          950: '#020617',   // SIDEBAR BG (dark)
        },
        // Semantic colors
        success: { 100: '#dcfce7', 500: '#22c55e', 900: '#14532d' },
        warning: { 100: '#fef9c3', 500: '#eab308', 900: '#713f12' },
        danger:  { 100: '#fee2e2', 500: '#ef4444', 900: '#7f1d1d' },
        info:    { 100: '#dbeafe', 500: '#3b82f6', 900: '#1e3a8a' },
      },
      fontFamily: {
        sans: ['Inter Variable', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
        xs:    ['0.75rem',  { lineHeight: '1rem' }],
        sm:    ['0.875rem', { lineHeight: '1.25rem' }],
        base:  ['1rem',     { lineHeight: '1.5rem' }],
        lg:    ['1.125rem', { lineHeight: '1.75rem' }],
        xl:    ['1.25rem',  { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem',   { lineHeight: '2rem' }],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        md:  '0.5rem',
        lg:  '0.75rem',
        xl:  '1rem',
        '2xl': '1.25rem',
      },
      boxShadow: {
        card:       '0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.07)',
        'card-hover': '0 4px 12px 0 rgb(0 0 0 / 0.10)',
        focus:      '0 0 0 3px rgb(99 102 241 / 0.35)',
      },
      transitionDuration: {
        DEFAULT: '150ms',
      },
    },
  },
  plugins: [],
}
