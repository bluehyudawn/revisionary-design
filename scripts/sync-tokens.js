#!/usr/bin/env node
/**
 * Token Sync — Figma → theme.js
 * Source of truth: Figma node 75:408 (RevisionOnline color palette)
 *
 * Usage:
 *   node scripts/sync-tokens.js          # audit only (dry run)
 *   node scripts/sync-tokens.js --write  # apply changes to theme.js
 *
 * To refresh figmaSnapshot, run via Claude Code:
 *   "Figma node 75:408 변수 다시 추출해서 sync-tokens.js 업데이트해줘"
 */

const fs = require('fs')
const path = require('path')

// ─── Figma Snapshot ────────────────────────────────────────────────────────
// Last pulled: 2026-03-28 via mcp__Figma-Desktop__get_variable_defs (node 75:408)
// Stone/700 has a dual-value bug in Figma ("44403B,#000000") — using first value.
const figmaSnapshot = {
  'black':           '#000000',
  'white':           '#FFFFFF',
  'Neutral/50':      '#FAFAFA',
  'Neutral/100':     '#F5F5F5',
  'Neutral/200':     '#E5E5E5',
  'Neutral/300':     '#D4D4D4',
  'Neutral/400':     '#A1A1A1',
  'Neutral/500':     '#737373',
  'Neutral/600':     '#525252',
  'Neutral/700':     '#404040',
  'Neutral/800':     '#262626',
  'Neutral/900':     '#171717',
  'Neutral/950':     '#0A0A0A',
  'Stone/50':        '#F8F8F6',
  'Stone/100':       '#F4F4F1',
  'Stone/200':       '#E7E5E4',
  'Stone/300':       '#D6D3D1',
  'Stone/400':       '#A6A09B',
  'Stone/500':       '#79716B',
  'Stone/600':       '#57534D',
  'Stone/700':       '#44403B',  // Figma bug: raw value was "#44403B,#000000"
  'Stone/800':       '#292524',
  'Stone/900':       '#1C1917',
  'Stone/950':       '#0C0A09',
  'Revision/50':     '#F5F2FF',
  'Revision/100':    '#ECE8FD',
  'Revision/200':    '#DCD1FF',
  'Revision/300':    '#C0AFFB',
  'Revision/400':    '#A280F8',
  'Revision/500':    '#783CF0',
  'Revision/600':    '#7225E6',
  'Revision/700':    '#6727BE',
  'Revision/800':    '#56219E',
  'Revision/900':    '#481D81',
  'Revision/950':    '#2C1157',
  'Red/50':          '#FEF2F2',
  'Red/100':         '#FEE2E2',
  'Red/200':         '#FECACA',
  'Red/300':         '#FCA5A5',
  'Red/400':         '#F87171',
  'Red/500':         '#EF4444',
  'Red/600':         '#E22C2C',
  'Red/700':         '#B91C1C',
  'Red/800':         '#991B1B',
  'Red/900':         '#7F1D1D',
  'Red/950':         '#450A0A',
  'Orange/50':       '#FFF7ED',
  'Orange/100':      '#FFEDD4',
  'Orange/200':      '#FED8AA',
  'Orange/300':      '#FDBB74',
  'Orange/400':      '#FB943C',
  'Orange/500':      '#F97516',
  'Orange/600':      '#EA5A0C',
  'Orange/700':      '#C2430C',
  'Orange/800':      '#9A3512',
  'Orange/900':      '#7C2E12',
  'Orange/950':      '#431507',
  'Grass/50':        '#F5F9EC',
  'Grass/100':       '#ECF4DC',
  'Grass/200':       '#D3E6B0',
  'Grass/300':       '#B5D581',
  'Grass/400':       '#99C15A',
  'Grass/500':       '#7BA63C',
  'Grass/600':       '#5F842C',
  'Grass/700':       '#4A6526',
  'Grass/800':       '#3D5123',
  'Grass/900':       '#354621',
  'Grass/950':       '#1A260D',
  'Emerald/50':      '#ECFDF7',
  'Emerald/100':     '#D1FAEA',
  'Emerald/200':     '#A8F2D9',
  'Emerald/300':     '#6FE6C6',
  'Emerald/400':     '#31D0AA',
  'Emerald/500':     '#12B795',
  'Emerald/600':     '#07947A',
  'Emerald/700':     '#057764',
  'Emerald/800':     '#075E51',
  'Emerald/900':     '#074D44',
  'Emerald/950':     '#022C27',
  'Blue Violet/50':  '#EDF3FF',
  'Blue Violet/100': '#DFE8FF',
  'Blue Violet/200': '#C5D5FF',
  'Blue Violet/300': '#A1B8FF',
  'Blue Violet/400': '#7C91FD',
  'Blue Violet/500': '#5967F4',
  'Blue Violet/600': '#4B4DED',
  'Blue Violet/700': '#3332D0',
  'Blue Violet/800': '#2B2CA8',
  'Blue Violet/900': '#2A2C85',
  'Blue Violet/950': '#191A4D',
  'Pink/50':         '#FEF5FD',
  'Pink/100':        '#FEE9FE',
  'Pink/200':        '#FBD3FA',
  'Pink/300':        '#F7B0F3',
  'Pink/400':        '#F181E8',
  'Pink/500':        '#E65CDA',
  'Pink/600':        '#C831B8',
  'Pink/700':        '#A62596',
  'Pink/800':        '#882079',
  'Pink/900':        '#6F2062',
  'Pink/950':        '#49093E',
  'Yellow/50':       '#FEFBE8',
  'Yellow/100':      '#FEF7C3',
  'Yellow/200':      '#FEEC86',
  'Yellow/300':      '#FDDB47',
  'Yellow/400':      '#FAC515',
  'Yellow/500':      '#EAAC08',
  'Yellow/600':      '#CA8404',
  'Yellow/700':      '#A15D07',
  'Yellow/800':      '#854A0E',
  'Yellow/900':      '#713C12',
  'Yellow/950':      '#421E06',
  'Sky/50':          '#F0F9FF',
  'Sky/100':         '#DFF2FE',
  'Sky/200':         '#BAE7FD',
  'Sky/300':         '#7DD5FC',
  'Sky/400':         '#38BFF8',
  'Sky/500':         '#0EA8E9',
  'Sky/600':         '#0287C7',
  'Sky/700':         '#036BA1',
  'Sky/800':         '#075B85',
  'Sky/900':         '#0C4B6E',
  'Sky/950':         '#083049',
}

// ─── Flatten theme.js colors for comparison ────────────────────────────────
function flattenThemeColors(tokens) {
  const flat = {}
  const { color } = tokens

  // top-level
  if (color.white) flat['white'] = color.white
  if (color.black) flat['black'] = color.black

  const paletteMap = {
    stone:       'Stone',
    neutral:     'Neutral',
    blueViolet:  'Blue Violet',
    revision:    'Revision',
    emerald:     'Emerald',
    orange:      'Orange',
    red:         'Red',
    grass:       'Grass',
    pink:        'Pink',
    yellow:      'Yellow',
    sky:         'Sky',
  }

  for (const [jsKey, figmaPrefix] of Object.entries(paletteMap)) {
    const palette = color[jsKey]
    if (!palette) continue
    for (const [shade, hex] of Object.entries(palette)) {
      flat[`${figmaPrefix}/${shade}`] = hex
    }
  }

  return flat
}

// ─── Normalise hex for comparison ─────────────────────────────────────────
const norm = (hex) => hex.trim().toUpperCase()

// ─── Main audit ───────────────────────────────────────────────────────────
const tokens = require('../theme.js')
const themeFlat = flattenThemeColors(tokens)

const missing   = []  // in Figma, not in theme.js
const changed   = []  // same key, different value
const extra     = []  // in theme.js, not in Figma (semantic tokens etc.)

for (const [key, figmaHex] of Object.entries(figmaSnapshot)) {
  if (!themeFlat[key]) {
    missing.push({ key, figmaHex })
  } else if (norm(themeFlat[key]) !== norm(figmaHex)) {
    changed.push({ key, themeHex: themeFlat[key], figmaHex })
  }
}

for (const key of Object.keys(themeFlat)) {
  if (!figmaSnapshot[key]) extra.push({ key, hex: themeFlat[key] })
}

// ─── Report ───────────────────────────────────────────────────────────────
const ok = missing.length === 0 && changed.length === 0

console.log('\n=== Token Sync Report ===')
console.log(`Source: Figma node 75:408  |  Date: ${new Date().toISOString().slice(0,10)}\n`)

if (ok) {
  console.log('✅  All color tokens are in sync with Figma.\n')
} else {
  if (missing.length) {
    console.log(`❌  Missing in theme.js (${missing.length}):`)
    missing.forEach(({ key, figmaHex }) =>
      console.log(`   + ${key.padEnd(22)} ${figmaHex}`)
    )
    console.log()
  }
  if (changed.length) {
    console.log(`⚠️   Value mismatch (${changed.length}):`)
    changed.forEach(({ key, themeHex, figmaHex }) =>
      console.log(`   ~ ${key.padEnd(22)} theme: ${themeHex}  figma: ${figmaHex}`)
    )
    console.log()
  }
}

if (extra.length) {
  console.log(`ℹ️   theme.js-only tokens (semantic/custom, ${extra.length}):`)
  extra.forEach(({ key, hex }) =>
    console.log(`   = ${key.padEnd(22)} ${hex}`)
  )
  console.log()
}

console.log(`Summary: ${Object.keys(figmaSnapshot).length} Figma tokens | ${Object.keys(themeFlat).length} theme.js tokens`)
if (!ok) {
  console.log('\nRun with --write to apply missing/changed tokens (not yet implemented).')
  process.exit(1)
}
