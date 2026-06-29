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
        // ── Brand ramp — Emerald (Nordic Forest accent) ──────────────
        brand: {
          50:  '#ecfdf5',  // lightest emerald wash
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',  // PRIMARY GLOW
          500: '#10b981',  // PRIMARY ACTION
          600: '#059669',  // HOVER
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },

        // ── Surface ramp — Forest Void ─────────────────────────────
        surface: {
          50:  '#f0f4f1',  // PAGE BG (light sage)
          100: '#e8efe9',  // CARD BG (light)
          200: '#cdddd0',  // BORDER (light)
          300: '#a0bda6',  // MUTED BORDER
          400: '#7a9e83',  // PLACEHOLDER TEXT
          500: '#4a6b52',  // SECONDARY TEXT
          700: '#1e2621',  // CARD BG (dark) — Elevated Sage Forest
          800: '#141a16',  // PAGE BG (dark) — Deep Forest Void
          900: '#111712',  // SIDEBAR (dark)
          950: '#0a0f0b',  // DEEPEST DARK
        },

        // ── Semantic — updated for forest theme ───────────────────
        success: {
          100: '#d1fae5',
          500: '#10b981',  // emerald (was green)
          900: '#064e3b',
        },
        warning: {
          100: '#fef3c7',
          500: '#f59e0b',  // amber
          900: '#78350f',
        },
        danger: {
          100: '#fee2e2',
          500: '#ef4444',
          900: '#7f1d1d',
        },
        info: {
          100: '#dbeafe',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
      },

      fontFamily: {
        sans: ['Inter', 'Inter Variable', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },

      fontSize: {
        '3xs': ['0.5rem',   { lineHeight: '0.75rem' }],
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
        '3xl': '1.5rem',
      },

      boxShadow: {
        // Forest-ambient card shadows
        card:         '0 1px 3px rgba(0,0,0,0.12), 0 0 0 1px rgba(52,211,153,0.04)',
        'card-hover': '0 6px 20px rgba(0,0,0,0.25), 0 0 0 1px rgba(52,211,153,0.08)',
        // Emerald focus ring
        focus:        '0 0 0 3px rgba(52, 211, 153, 0.30)',
        // Emerald glow for CTAs
        'emerald-glow': '0 0 16px rgba(52, 211, 153, 0.25), 0 4px 12px rgba(52,211,153,0.15)',
      },

      transitionDuration: {
        DEFAULT: '150ms',
      },

      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-4px)' },
          '40%, 80%': { transform: 'translateX(4px)' },
        },
      },

      animation: {
        'fade-in':  'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        shake:      'shake 0.35s ease-in-out',
      },
    },
  },
  plugins: [],
}
