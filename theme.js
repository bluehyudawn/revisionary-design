/**
 * Design Tokens — auto-extracted from Figma variables
 * Source: Figma Desktop MCP · RevisionOnline
 * Last synced: 2026-03-28
 *
 * DO NOT hardcode these values elsewhere.
 * - CSS consumers  → use theme.css custom properties (var(--...))
 * - JS/TS consumers → import from this file
 * - Tailwind        → see tailwind.config.js
 */

const tokens = {
  color: {
    white: '#FFFFFF',
    black: '#000000',

    /* ── Palettes ──────────────────────────────────── */
    stone: {
      50:  '#F8F8F6',
      100: '#F4F4F1',
      200: '#E7E5E4',
      300: '#D6D3D1',
      400: '#A6A09B',
      500: '#79716B',
      600: '#57534D',
      700: '#44403B',
      800: '#292524',
      900: '#1C1917',
      950: '#0C0A09',
    },
    neutral: {
      50:  '#FAFAFA',
      100: '#F5F5F5',
      200: '#E5E5E5',
      300: '#D4D4D4',
      400: '#A1A1A1',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
      950: '#0A0A0A',
    },
    blueViolet: {
      50:  '#EDF3FF',
      100: '#DFE8FF',
      200: '#C5D5FF',
      300: '#A1B8FF',
      400: '#7C91FD',
      500: '#5967F4',
      600: '#4B4DED',
      700: '#3332D0',
      800: '#2B2CA8',
      900: '#2A2C85',
      950: '#191A4D',
    },
    revision: {
      50:  '#F5F2FF',
      100: '#ECE8FD',
      200: '#DCD1FF',
      300: '#C0AFFB',
      400: '#A280F8',
      500: '#783CF0',
      600: '#7225E6',
      700: '#6727BE',
      800: '#56219E',
      900: '#481D81',
      950: '#2C1157',
    },
    emerald: {
      50:  '#ECFDF7',
      100: '#D1FAEA',
      200: '#A8F2D9',
      300: '#6FE6C6',
      400: '#31D0AA',
      500: '#12B795',
      600: '#07947A',
      700: '#057764',
      800: '#075E51',
      900: '#074D44',
      950: '#022C27',
    },
    orange: {
      50:  '#FFF7ED',
      100: '#FFEDD4',
      200: '#FED8AA',
      300: '#FDBB74',
      400: '#FB943C',
      500: '#F97516',
      600: '#EA5A0C',
      700: '#C2430C',
      800: '#9A3512',
      900: '#7C2E12',
      950: '#431507',
    },
    red: {
      50:  '#FEF2F2',
      100: '#FEE2E2',
      200: '#FECACA',
      300: '#FCA5A5',
      400: '#F87171',
      500: '#EF4444',
      600: '#E22C2C',
      700: '#B91C1C',
      800: '#991B1B',
      900: '#7F1D1D',
      950: '#450A0A',
    },
    grass: {
      50:  '#F5F9EC',
      100: '#ECF4DC',
      200: '#D3E6B0',
      300: '#B5D581',
      400: '#99C15A',
      500: '#7BA63C',
      600: '#5F842C',
      700: '#4A6526',
      800: '#3D5123',
      900: '#354621',
      950: '#1A260D',
    },
    pink: {
      50:  '#FEF5FD',
      100: '#FEE9FE',
      200: '#FBD3FA',
      300: '#F7B0F3',
      400: '#F181E8',
      500: '#E65CDA',
      600: '#C831B8',
      700: '#A62596',
      800: '#882079',
      900: '#6F2062',
      950: '#49093E',
    },
    yellow: {
      50:  '#FEFBE8',
      100: '#FEF7C3',
      200: '#FEEC86',
      300: '#FDDB47',
      400: '#FAC515',
      500: '#EAAC08',
      600: '#CA8404',
      700: '#A15D07',
      800: '#854A0E',
      900: '#713C12',
      950: '#421E06',
    },
    sky: {
      50:  '#F0F9FF',
      100: '#DFF2FE',
      200: '#BAE7FD',
      300: '#7DD5FC',
      400: '#38BFF8',
      500: '#0EA8E9',
      600: '#0287C7',
      700: '#036BA1',
      800: '#075B85',
      900: '#0C4B6E',
      950: '#083049',
    },

    /* ── Semantic ──────────────────────────────────── */
    label: {
      normal: '#171719',
    },
    fill: {
      strong: '#70737C',
    },
  },

  typography: {
    fontFamily: {
      sans:       '"Inter", sans-serif',
      heading:    '"Nunito", sans-serif',
      interTight: '"Inter Tight", sans-serif',
    },
    /** raw size values (px) */
    size: {
      10: '10px',
      12: '12px',
      14: '14px',
      16: '16px',
      18: '18px',
      20: '20px',
      24: '24px',
      28: '28px',
      32: '32px',
      48: '48px',
      64: '64px',
    },
    /** unitless line-height ratios */
    lineHeight: {
      none:   '1',    // 100% — headers, captions
      snug:   '1.34', // body normal
      normal: '1.44', // body reading, caption1-regular
      tight:  '1.24', // h3-bold
    },
    letterSpacing: {
      0: '0',
    },
    fontWeight: {
      regular:   400,
      medium:    500,
      semibold:  600,
      bold:      700,
      extrabold: 800,
    },
  },

  /**
   * Composite font styles — each entry maps directly to a Figma text style.
   * Key format: "<category>/<variant>"
   */
  fontStyle: {
    /* ── Header ──────────────────────────────────── */
    'h1-bold': {
      fontFamily:    '"Nunito", sans-serif',
      fontSize:      '64px',
      fontWeight:    800,
      lineHeight:    '1',
      letterSpacing: '0',
    },
    'h2-bold': {
      fontFamily:    '"Nunito", sans-serif',
      fontSize:      '48px',
      fontWeight:    800,
      lineHeight:    '1',
      letterSpacing: '0',
    },
    'h3-bold': {
      fontFamily:    '"Nunito", sans-serif',
      fontSize:      '32px',
      fontWeight:    800,
      lineHeight:    '1.24',
      letterSpacing: '0',
    },
    'h4-bold': {
      fontFamily:    '"Nunito", sans-serif',
      fontSize:      '28px',
      fontWeight:    800,
      lineHeight:    '1',
      letterSpacing: '0',
    },
    'h5-bold': {
      fontFamily:    '"Nunito", sans-serif',
      fontSize:      '24px',
      fontWeight:    800,
      lineHeight:    '1',
      letterSpacing: '0',
    },
    'h6-bold': {
      fontFamily:    '"Nunito", sans-serif',
      fontSize:      '20px',
      fontWeight:    800,
      lineHeight:    '1',
      letterSpacing: '0',
    },

    /* ── Section ─────────────────────────────────── */
    'section-regular': {
      fontFamily:    '"Inter", sans-serif',
      fontSize:      '28px',
      fontWeight:    400,
      lineHeight:    '1',
      letterSpacing: '0',
    },

    /* ── Subtitle ────────────────────────────────── */
    'subtitle1-regular': {
      fontFamily:    '"Inter Tight", sans-serif',
      fontSize:      '24px',
      fontWeight:    400,
      lineHeight:    '1',
      letterSpacing: '0',
    },
    'subtitle2-semibold': {
      fontFamily:    '"Inter", sans-serif',
      fontSize:      '18px',
      fontWeight:    600,
      lineHeight:    '1',
      letterSpacing: '0',
    },
    'subtitle2-medium': {
      fontFamily:    '"Inter", sans-serif',
      fontSize:      '18px',
      fontWeight:    500,
      lineHeight:    '1',
      letterSpacing: '0',
    },
    'subtitle2-regular': {
      fontFamily:    '"Inter", sans-serif',
      fontSize:      '18px',
      fontWeight:    400,
      lineHeight:    '1',
      letterSpacing: '0',
    },

    /* ── Body / Normal ───────────────────────────── */
    'body1-bold': {
      fontFamily:    '"Inter", sans-serif',
      fontSize:      '16px',
      fontWeight:    700,
      lineHeight:    '1.34',
      letterSpacing: '0',
    },
    'body1-semibold': {
      fontFamily:    '"Inter", sans-serif',
      fontSize:      '16px',
      fontWeight:    600,
      lineHeight:    '1.34',
      letterSpacing: '0',
    },
    'body1-medium': {
      fontFamily:    '"Inter", sans-serif',
      fontSize:      '16px',
      fontWeight:    500,
      lineHeight:    '1.34',
      letterSpacing: '0',
    },
    'body1-regular': {
      fontFamily:    '"Inter", sans-serif',
      fontSize:      '16px',
      fontWeight:    400,
      lineHeight:    '1.34',
      letterSpacing: '0',
    },
    /** Nunito heading-style at body size */
    'body1-bold-h': {
      fontFamily:    '"Nunito", sans-serif',
      fontSize:      '16px',
      fontWeight:    800,
      lineHeight:    '1',
      letterSpacing: '0',
    },
    'body2-bold': {
      fontFamily:    '"Inter", sans-serif',
      fontSize:      '14px',
      fontWeight:    700,
      lineHeight:    '1.34',
      letterSpacing: '0',
    },
    'body2-medium': {
      fontFamily:    '"Inter", sans-serif',
      fontSize:      '14px',
      fontWeight:    500,
      lineHeight:    '1.34',
      letterSpacing: '0',
    },
    'body2-regular': {
      fontFamily:    '"Inter", sans-serif',
      fontSize:      '14px',
      fontWeight:    400,
      lineHeight:    '1.34',
      letterSpacing: '0',
    },
    'body2-bold-h': {
      fontFamily:    '"Nunito", sans-serif',
      fontSize:      '14px',
      fontWeight:    800,
      lineHeight:    '1.34',
      letterSpacing: '0',
    },

    /* ── Body / Reading ──────────────────────────── */
    'body1-reading-medium': {
      fontFamily:    '"Inter", sans-serif',
      fontSize:      '16px',
      fontWeight:    500,
      lineHeight:    '1.44',
      letterSpacing: '0',
    },
    'body1-reading-regular': {
      fontFamily:    '"Inter", sans-serif',
      fontSize:      '16px',
      fontWeight:    400,
      lineHeight:    '1.44',
      letterSpacing: '0',
    },
    'body2-reading-medium': {
      fontFamily:    '"Inter", sans-serif',
      fontSize:      '14px',
      fontWeight:    500,
      lineHeight:    '1.44',
      letterSpacing: '0',
    },
    'body2-reading-regular': {
      fontFamily:    '"Inter", sans-serif',
      fontSize:      '14px',
      fontWeight:    400,
      lineHeight:    '1.44',
      letterSpacing: '0',
    },

    /* ── Caption ─────────────────────────────────── */
    'caption1-bold': {
      fontFamily:    '"Inter", sans-serif',
      fontSize:      '12px',
      fontWeight:    700,
      lineHeight:    '1',
      letterSpacing: '0',
    },
    'caption1-semibold': {
      fontFamily:    '"Inter", sans-serif',
      fontSize:      '12px',
      fontWeight:    600,
      lineHeight:    '1',
      letterSpacing: '0',
    },
    'caption1-medium': {
      fontFamily:    '"Inter", sans-serif',
      fontSize:      '12px',
      fontWeight:    500,
      lineHeight:    '1',
      letterSpacing: '0',
    },
    'caption1-regular': {
      fontFamily:    '"Inter", sans-serif',
      fontSize:      '12px',
      fontWeight:    400,
      lineHeight:    '1.44',
      letterSpacing: '0',
    },
    'caption2-semibold': {
      fontFamily:    '"Inter", sans-serif',
      fontSize:      '10px',
      fontWeight:    600,
      lineHeight:    '1',
      letterSpacing: '0',
    },
    'caption2-regular': {
      fontFamily:    '"Inter", sans-serif',
      fontSize:      '10px',
      fontWeight:    400,
      lineHeight:    '1',
      letterSpacing: '0',
    },
  },
}

module.exports = tokens
