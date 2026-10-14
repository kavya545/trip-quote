/**
 * Design tokens: the only place colours are defined.
 *
 * Every token is tied to a colour variable in the Fleeguide Figma file
 * (https://www.figma.com/design/FFULIvAdvUc29HzIiLXXla), so a value changed here can be matched there
 * by name. `npm run tokens` writes src/tokens.css (CSS custom properties for index.css) and
 * design-tokens.json (the same map in W3C design-token format, with the Figma variable for each).
 */

/** Figma variable a token is bound to: collection, variable name and variable id. */
interface FigmaVar { collection: 'Colors' | 'Primitives' | 'Trip Quote (built)'; name: string; id: string }

const t = <V extends string>(value: V, use: string, figma: FigmaVar) => ({ value, use, figma });

export const tokens = {
  ink:           t('#1E1F21', 'Primary text, dark buttons, step bar, toast', { collection: 'Colors', name: 'project/gray-950', id: 'VariableID:1:9392' }),
  inkSoft:       t('#3E4145', 'Body copy in panels, photo placeholder, dark-button hover', { collection: 'Colors', name: 'project/gray-800', id: 'VariableID:1:9370' }),
  textSecondary: t('#5F6266', 'Secondary text (4.8–6.1:1 on light surfaces)', { collection: 'Colors', name: 'project/gray-600', id: 'VariableID:1:9388' }),
  textMuted:     t('#6B6E72', 'Lightest grey allowed for text (≥ 4.57:1)', { collection: 'Trip Quote (built)', name: 'color/text-muted', id: 'VariableID:8:3' }),
  disabled:      t('#98989B', 'Disabled controls and borders only, never readable text', { collection: 'Trip Quote (built)', name: 'color/disabled', id: 'VariableID:16:979' }),
  onDarkMuted:   t('#B5B7BA', 'Muted text on ink', { collection: 'Colors', name: 'project/gray-400', id: 'VariableID:1:9393' }),
  borderStrong:  t('#CFCFCD', 'Input and button borders', { collection: 'Colors', name: 'project/gray-300', id: 'VariableID:1:9384' }),
  skeleton:      t('#D9D9D7', 'Loading placeholder (hero)', { collection: 'Trip Quote (built)', name: 'color/skeleton', id: 'VariableID:8:6' }),
  border:        t('#E4E4E2', 'Card borders, dividers, segment card background', { collection: 'Colors', name: 'project/gray-200', id: 'VariableID:1:9386' }),
  chip:          t('#EBEBEA', 'Chips, avatars, segmented controls', { collection: 'Colors', name: 'project/gray-150', id: 'VariableID:1:9377' }),
  pillLocked:    t('#EFEFEE', 'Locked-price status pill', { collection: 'Trip Quote (built)', name: 'color/pill-locked', id: 'VariableID:29:2' }),
  surfaceAlt:    t('#F2F2F0', 'Feature tags, comparison stop header, empty-state icon', { collection: 'Trip Quote (built)', name: 'color/surface-alt', id: 'VariableID:8:5' }),
  page:          t('#F2F2F2', 'Page background, light hover', { collection: 'Trip Quote (built)', name: 'color/page', id: 'VariableID:8:4' }),
  rowHighlight:  t('#F4F4F3', 'Changed line in the review table', { collection: 'Colors', name: 'project/gray-50', id: 'VariableID:1:9398' }),
  drawer:        t('#F5F5F4', 'Side panel (drawer) background', { collection: 'Trip Quote (built)', name: 'color/drawer', id: 'VariableID:29:3' }),
  rowChanged:    t('#F8F8F7', 'Changed row in the What’s changed comparison', { collection: 'Trip Quote (built)', name: 'color/row-changed', id: 'VariableID:29:4' }),
  surfaceRaised: t('#FAFAF9', 'Hotel and activity rows, drawer header', { collection: 'Colors', name: 'project/gray-25', id: 'VariableID:1:9374' }),
  white:         t('#FFFFFF', 'Cards, text on ink', { collection: 'Colors', name: 'project/white', id: 'VariableID:1:9385' }),
  lower:         t('#197047', 'Cheaper than the original quote', { collection: 'Primitives', name: 'color/positive/600', id: 'VariableID:1:9389' }),
  higher:        t('#B8433B', 'Costs more than the original quote, errors', { collection: 'Primitives', name: 'color/negative/600', id: 'VariableID:1:9390' }),
  errorBg:       t('#FBE9E7', 'Error icon circle', { collection: 'Trip Quote (built)', name: 'color/error-bg', id: 'VariableID:8:8' }),
  success:       t('#3DAA4F', 'Confirmation icons', { collection: 'Trip Quote (built)', name: 'color/success', id: 'VariableID:8:7' }),
} as const;

export type ColorToken = keyof typeof tokens;

/** Token values by name, for inline styles: `color.ink` → '#1E1F21'. */
export const color = Object.fromEntries(Object.entries(tokens).map(([k, v]) => [k, v.value])) as { [K in ColorToken]: (typeof tokens)[K]['value'] };

/** A token at reduced opacity, e.g. `alpha(color.ink, 0.45)` → 'rgba(30,31,33,0.45)'. */
export const alpha = (hex: string, a: number) => `rgba(${parseInt(hex.slice(1, 3), 16)},${parseInt(hex.slice(3, 5), 16)},${parseInt(hex.slice(5, 7), 16)},${a})`;

/** CSS custom property name for a token: ink → --color-ink, textSecondary → --color-text-secondary. */
export const cssVar = (name: ColorToken) => `--color-${name.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}`;
