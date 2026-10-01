const sharp = require('sharp');
const path = require('path');

const ACCENT = '#2F6FED';
const ACCENT_DARK = '#1B4FC9';
const CREAM = '#F4F1EA';
const WHITE = '#FFFFFF';

const ASSETS_DIR = path.join(__dirname, '..', 'assets');

function gridLines(cx, cy, g, thickWidth, thinWidth, color, thinOpacity) {
  const half = g / 2;
  const x0 = cx - half;
  const x1 = cx + half;
  const y0 = cy - half;
  const y1 = cy + half;
  const third = g / 3;
  let lines = '';

  // Thin cell dividers (every 1/9th), skip positions that coincide with thick block lines.
  for (let i = 1; i < 9; i++) {
    if (i % 3 === 0) continue;
    const x = x0 + (g / 9) * i;
    const y = y0 + (g / 9) * i;
    lines += `<line x1="${x}" y1="${y0}" x2="${x}" y2="${y1}" stroke="${color}" stroke-width="${thinWidth}" opacity="${thinOpacity}" />`;
    lines += `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="${color}" stroke-width="${thinWidth}" opacity="${thinOpacity}" />`;
  }

  // Thick block dividers + outer border (at 0, 1/3, 2/3, 1).
  for (let i = 0; i <= 3; i++) {
    const x = x0 + third * i;
    const y = y0 + third * i;
    lines += `<line x1="${x}" y1="${y0}" x2="${x}" y2="${y1}" stroke="${color}" stroke-width="${thickWidth}" />`;
    lines += `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="${color}" stroke-width="${thickWidth}" />`;
  }

  return lines;
}

function digitAt(cx, cy, g, row, col, digit, color, fontSize) {
  const cellSize = g / 9;
  const half = g / 2;
  const x = cx - half + cellSize * (col + 0.5);
  const y = cy - half + cellSize * (row + 0.5);
  return `<text x="${x}" y="${y}" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="${fontSize}" fill="${color}" text-anchor="middle" dominant-baseline="central">${digit}</text>`;
}

function iconSvg({ size, background, gridColor, gridSize, thickWidth, thinWidth, thinOpacity, digits, digitColor }) {
  const cx = size / 2;
  const cy = size / 2;
  const bg = background
    ? `
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${ACCENT}" />
          <stop offset="100%" stop-color="${ACCENT_DARK}" />
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" fill="url(#bg)" />
    `
    : '';
  const digitEls = digits
    .map((d) => digitAt(cx, cy, gridSize, d.row, d.col, d.value, digitColor, d.fontSize ?? gridSize / 9 * 0.62))
    .join('');
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      ${bg}
      ${gridLines(cx, cy, gridSize, thickWidth, thinWidth, gridColor, thinOpacity)}
      ${digitEls}
    </svg>
  `;
}

const SAMPLE_DIGITS = [
  { row: 1, col: 1, value: 5 },
  { row: 4, col: 4, value: 8 },
  { row: 7, col: 7, value: 3 },
];

async function render(svg, size, outFile) {
  await sharp(Buffer.from(svg), { density: 300 })
    .resize(size, size)
    .png()
    .toFile(outFile);
  console.log(`wrote ${outFile} (${size}x${size})`);
}

async function main() {
  // Main app icon (iOS) — full square, solid gradient background, white grid + digits.
  const iconSize = 1024;
  const icon = iconSvg({
    size: iconSize,
    background: true,
    gridColor: WHITE,
    gridSize: 760,
    thickWidth: 26,
    thinWidth: 7,
    thinOpacity: 0.4,
    digits: SAMPLE_DIGITS,
    digitColor: WHITE,
  });
  await render(icon, iconSize, path.join(ASSETS_DIR, 'icon.png'));

  // Android adaptive icon — background layer (solid gradient, no grid).
  const bgOnly = iconSvg({
    size: iconSize,
    background: true,
    gridColor: WHITE,
    gridSize: 0,
    thickWidth: 0,
    thinWidth: 0,
    thinOpacity: 0,
    digits: [],
    digitColor: WHITE,
  });
  await render(bgOnly, iconSize, path.join(ASSETS_DIR, 'android-icon-background.png'));

  // Android adaptive icon — foreground layer (transparent bg, white grid, kept within safe zone).
  const foreground = iconSvg({
    size: iconSize,
    background: false,
    gridColor: WHITE,
    gridSize: 600,
    thickWidth: 22,
    thinWidth: 6,
    thinOpacity: 0.5,
    digits: SAMPLE_DIGITS,
    digitColor: WHITE,
  });
  await render(foreground, iconSize, path.join(ASSETS_DIR, 'android-icon-foreground.png'));

  // Android themed (monochrome) icon — single-color silhouette, transparent bg.
  const monochrome = iconSvg({
    size: iconSize,
    background: false,
    gridColor: WHITE,
    gridSize: 600,
    thickWidth: 22,
    thinWidth: 6,
    thinOpacity: 1,
    digits: SAMPLE_DIGITS,
    digitColor: WHITE,
  });
  await render(monochrome, iconSize, path.join(ASSETS_DIR, 'android-icon-monochrome.png'));

  // Favicon — small simplified version (digits dropped, they wouldn't read at 48px).
  const faviconSize = 48;
  const favicon = iconSvg({
    size: iconSize,
    background: true,
    gridColor: WHITE,
    gridSize: 760,
    thickWidth: 34,
    thinWidth: 10,
    thinOpacity: 0.4,
    digits: [],
    digitColor: WHITE,
  });
  await render(favicon, faviconSize, path.join(ASSETS_DIR, 'favicon.png'));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
