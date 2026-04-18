/** @type {import('tailwindcss').Config} */

/**
 * Tailwind Theme — Design Tokens Bridge
 * Source: Figma Desktop MCP · RevisionOnline
 * Last synced: 2026-03-28
 *
 * Colors and typography are referenced via CSS custom properties (var(--...))
 * defined in theme.css. Raw values live in theme.js.
 *
 * Usage examples:
 *   text-label-normal, bg-revision-500, text-stone-200
 *   text-sm, text-base, font-medium, font-extrabold
 *   font-sans, font-heading
 */

module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,vue}',
  ],

  theme: {
    extend: {
      /* ── Colors ──────────────────────────────────────────────────────── */
      colors: {
        white: 'var(--color-white)',
        black: 'var(--color-black)',

        stone: {
          50:  'var(--color-stone-50)',
          100: 'var(--color-stone-100)',
          200: 'var(--color-stone-200)',
          300: 'var(--color-stone-300)',
          400: 'var(--color-stone-400)',
          500: 'var(--color-stone-500)',
          600: 'var(--color-stone-600)',
          700: 'var(--color-stone-700)',
          800: 'var(--color-stone-800)',
          900: 'var(--color-stone-900)',
          950: 'var(--color-stone-950)',
        },
        neutral: {
          50:  'var(--color-neutral-50)',
          100: 'var(--color-neutral-100)',
          200: 'var(--color-neutral-200)',
          300: 'var(--color-neutral-300)',
          400: 'var(--color-neutral-400)',
          500: 'var(--color-neutral-500)',
          600: 'var(--color-neutral-600)',
          700: 'var(--color-neutral-700)',
          800: 'var(--color-neutral-800)',
          900: 'var(--color-neutral-900)',
          950: 'var(--color-neutral-950)',
        },
        'blue-violet': {
          50:  'var(--color-blue-violet-50)',
          100: 'var(--color-blue-violet-100)',
          200: 'var(--color-blue-violet-200)',
          300: 'var(--color-blue-violet-300)',
          400: 'var(--color-blue-violet-400)',
          500: 'var(--color-blue-violet-500)',
          600: 'var(--color-blue-violet-600)',
          700: 'var(--color-blue-violet-700)',
          800: 'var(--color-blue-violet-800)',
          900: 'var(--color-blue-violet-900)',
          950: 'var(--color-blue-violet-950)',
        },
        revision: {
          50:  'var(--color-revision-50)',
          100: 'var(--color-revision-100)',
          200: 'var(--color-revision-200)',
          300: 'var(--color-revision-300)',
          400: 'var(--color-revision-400)',
          500: 'var(--color-revision-500)',
          600: 'var(--color-revision-600)',
          700: 'var(--color-revision-700)',
          800: 'var(--color-revision-800)',
          900: 'var(--color-revision-900)',
          950: 'var(--color-revision-950)',
        },
        emerald: {
          50:  'var(--color-emerald-50)',
          100: 'var(--color-emerald-100)',
          200: 'var(--color-emerald-200)',
          300: 'var(--color-emerald-300)',
          400: 'var(--color-emerald-400)',
          500: 'var(--color-emerald-500)',
          600: 'var(--color-emerald-600)',
          700: 'var(--color-emerald-700)',
          800: 'var(--color-emerald-800)',
          900: 'var(--color-emerald-900)',
          950: 'var(--color-emerald-950)',
        },
        orange: {
          50:  'var(--color-orange-50)',
          100: 'var(--color-orange-100)',
          200: 'var(--color-orange-200)',
          300: 'var(--color-orange-300)',
          400: 'var(--color-orange-400)',
          500: 'var(--color-orange-500)',
          600: 'var(--color-orange-600)',
          700: 'var(--color-orange-700)',
          800: 'var(--color-orange-800)',
          900: 'var(--color-orange-900)',
          950: 'var(--color-orange-950)',
        },
        red: {
          50:  'var(--color-red-50)',
          100: 'var(--color-red-100)',
          200: 'var(--color-red-200)',
          300: 'var(--color-red-300)',
          400: 'var(--color-red-400)',
          500: 'var(--color-red-500)',
          600: 'var(--color-red-600)',
          700: 'var(--color-red-700)',
          800: 'var(--color-red-800)',
          900: 'var(--color-red-900)',
          950: 'var(--color-red-950)',
        },
        grass: {
          50:  'var(--color-grass-50)',
          100: 'var(--color-grass-100)',
          200: 'var(--color-grass-200)',
          300: 'var(--color-grass-300)',
          400: 'var(--color-grass-400)',
          500: 'var(--color-grass-500)',
          600: 'var(--color-grass-600)',
          700: 'var(--color-grass-700)',
          800: 'var(--color-grass-800)',
          900: 'var(--color-grass-900)',
          950: 'var(--color-grass-950)',
        },
        pink: {
          50:  'var(--color-pink-50)',
          100: 'var(--color-pink-100)',
          200: 'var(--color-pink-200)',
          300: 'var(--color-pink-300)',
          400: 'var(--color-pink-400)',
          500: 'var(--color-pink-500)',
          600: 'var(--color-pink-600)',
          700: 'var(--color-pink-700)',
          800: 'var(--color-pink-800)',
          900: 'var(--color-pink-900)',
          950: 'var(--color-pink-950)',
        },
        yellow: {
          50:  'var(--color-yellow-50)',
          100: 'var(--color-yellow-100)',
          200: 'var(--color-yellow-200)',
          300: 'var(--color-yellow-300)',
          400: 'var(--color-yellow-400)',
          500: 'var(--color-yellow-500)',
          600: 'var(--color-yellow-600)',
          700: 'var(--color-yellow-700)',
          800: 'var(--color-yellow-800)',
          900: 'var(--color-yellow-900)',
          950: 'var(--color-yellow-950)',
        },
        sky: {
          50:  'var(--color-sky-50)',
          100: 'var(--color-sky-100)',
          200: 'var(--color-sky-200)',
          300: 'var(--color-sky-300)',
          400: 'var(--color-sky-400)',
          500: 'var(--color-sky-500)',
          600: 'var(--color-sky-600)',
          700: 'var(--color-sky-700)',
          800: 'var(--color-sky-800)',
          900: 'var(--color-sky-900)',
          950: 'var(--color-sky-950)',
        },
        label: {
          normal: 'var(--color-label-normal)',
        },
        fill: {
          strong: 'var(--color-fill-strong)',
        },
      },

      /* ── Font family ─────────────────────────────────────────────────── */
      fontFamily: {
        sans:       ['var(--font-family-sans)'],
        heading:    ['var(--font-family-heading)'],
        tight:      ['var(--font-family-tight)'],
      },

      /* ── Font size + paired default line-height ──────────────────────── */
      fontSize: {
        // Figma: Caption2  (10px / lh 100%)
        '2xs': ['var(--type-size-10)', { lineHeight: 'var(--type-line-height-none)' }],
        // Figma: Caption1  (12px / lh 1.44 for regular, 100% for others)
        xs:    ['var(--type-size-12)', { lineHeight: 'var(--type-line-height-normal)' }],
        // Figma: Body2     (14px / lh 1.34)
        sm:    ['var(--type-size-14)', { lineHeight: 'var(--type-line-height-snug)' }],
        // Figma: Body1     (16px / lh 1.34)
        base:  ['var(--type-size-16)', { lineHeight: 'var(--type-line-height-snug)' }],
        // Figma: Subtitle2 (18px / lh 100%)
        lg:    ['var(--type-size-18)', { lineHeight: 'var(--type-line-height-none)' }],
        // Figma: H6        (20px / lh 100%)
        xl:    ['var(--type-size-20)', { lineHeight: 'var(--type-line-height-none)' }],
        // Figma: H5        (24px / lh 100%)
        '2xl': ['var(--type-size-24)', { lineHeight: 'var(--type-line-height-none)' }],
        // Figma: H4/Section (28px / lh 100%)
        '3xl': ['var(--type-size-28)', { lineHeight: 'var(--type-line-height-none)' }],
        // Figma: H3        (32px / lh 1.24)
        '4xl': ['var(--type-size-32)', { lineHeight: 'var(--type-line-height-tight)' }],
        // Figma: H2        (48px / lh 100%)
        '5xl': ['var(--type-size-48)', { lineHeight: 'var(--type-line-height-none)' }],
        // Figma: H1        (64px / lh 100%)
        '6xl': ['var(--type-size-64)', { lineHeight: 'var(--type-line-height-none)' }],
      },

      /* ── Font weight ─────────────────────────────────────────────────── */
      fontWeight: {
        regular:   'var(--font-weight-regular)',
        medium:    'var(--font-weight-medium)',
        semibold:  'var(--font-weight-semibold)',
        bold:      'var(--font-weight-bold)',
        extrabold: 'var(--font-weight-extrabold)',
      },

      /* ── Line height ─────────────────────────────────────────────────── */
      lineHeight: {
        none:   'var(--type-line-height-none)',
        tight:  'var(--type-line-height-tight)',
        snug:   'var(--type-line-height-snug)',
        normal: 'var(--type-line-height-normal)',
      },

      /* ── Letter spacing ──────────────────────────────────────────────── */
      letterSpacing: {
        0: 'var(--type-letter-spacing-0)',
      },
    },
  },

  plugins: [],
}
