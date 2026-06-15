import { createRng, pick, randomFloat, randomInt, type Rng } from '../utils/rng.js';
import type { SupportedLocale } from '../utils/validation.js';

type CoverInput = {
  locale: SupportedLocale;
  seed: string;
  index: number;
  title: string;
  artist: string;
  genre: string;
};

const palettes = [
  ['#111827', '#ef4444', '#f59e0b', '#f8fafc', '#38bdf8'],
  ['#0f172a', '#14b8a6', '#facc15', '#f8fafc', '#f97316'],
  ['#18181b', '#a3e635', '#22d3ee', '#f5f5f4', '#fb7185'],
  ['#1f2937', '#f472b6', '#60a5fa', '#f9fafb', '#34d399'],
  ['#292524', '#eab308', '#84cc16', '#fff7ed', '#fb923c'],
  ['#172554', '#f43f5e', '#2dd4bf', '#eff6ff', '#c084fc'],
];

type PatternKind = 'rings' | 'tiles' | 'orbit' | 'waveform';

const patternKinds: PatternKind[] = ['rings', 'tiles', 'orbit', 'waveform'];

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function wrapText(value: string, maxCharacters: number): string[] {
  const words = value.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const candidate = current.length > 0 ? `${current} ${word}` : word;

    if (candidate.length > maxCharacters && current.length > 0) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }

  if (current.length > 0) {
    lines.push(current);
  }

  return lines.length > 0 ? lines : [value];
}

function polygonPoints(cx: number, cy: number, radius: number, sides: number, rotation: number): string {
  return Array.from({ length: sides }, (_, pointIndex) => {
    const angle = rotation + (Math.PI * 2 * pointIndex) / sides;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
}

function textBlock(lines: string[], x: number, y: number, size: number, color: string, weight: number): string {
  const tspans = lines
    .slice(0, 3)
    .map((line, lineIndex) => {
      const dy = lineIndex === 0 ? 0 : size * 1.05;
      return `<tspan x="${x}" dy="${dy}">${escapeXml(line)}</tspan>`;
    })
    .join('');

  return `<text x="${x}" y="${y}" font-family="Inter, ui-sans-serif, system-ui, sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}" letter-spacing="0">${tspans}</text>`;
}

function buildPattern(kind: PatternKind, rng: Rng, palette: string[], accent: string, secondary: string): string {
  const brightColors = palette.slice(1);

  switch (kind) {
    case 'rings':
      return Array.from({ length: 9 }, (_, ringIndex) => {
        const size = 92 + ringIndex * 52;
        const color = ringIndex % 2 === 0 ? accent : secondary;
        const opacity = 0.1 + ringIndex * 0.025;

        return `<circle cx="320" cy="320" r="${size}" fill="none" stroke="${color}" stroke-width="3" opacity="${opacity}" />`;
      }).join('');

    case 'tiles':
      return Array.from({ length: 64 }, (_, tileIndex) => {
        const row = Math.floor(tileIndex / 8);
        const col = tileIndex % 8;
        const rotate = randomInt(rng, -12, 12);
        const fill = pick(rng, palette);

        return `<rect x="${col * 80 - 8}" y="${row * 80 - 8}" width="70" height="70" rx="12" fill="${fill}" opacity="0.18" transform="rotate(${rotate} ${col * 80 + 32} ${row * 80 + 32})" />`;
      }).join('');

    case 'orbit':
      return Array.from({ length: 18 }, (_, dotIndex) => {
        const angle = (Math.PI * 2 * dotIndex) / 18 + randomFloat(rng) * 0.3;
        const distance = 78 + (dotIndex % 5) * 42;
        const x = 320 + Math.cos(angle) * distance;
        const y = 320 + Math.sin(angle) * distance;
        const radius = randomInt(rng, 5, 22);
        const fill = pick(rng, brightColors);

        return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${radius}" fill="${fill}" opacity="0.45" />`;
      }).join('');

    case 'waveform':
      return Array.from({ length: 42 }, (_, waveIndex) => {
        const x = 20 + waveIndex * 15;
        const height = randomInt(rng, 45, 240);
        const fill = pick(rng, brightColors);

        return `<rect x="${x}" y="${320 - height / 2}" width="8" height="${height}" rx="4" fill="${fill}" opacity="0.28" />`;
      }).join('');
  }
}

export function generateCoverSvg({ locale, seed, index, title, artist, genre }: CoverInput): string {
  const rng = createRng(`cover:${locale}:${seed}:${index}`);
  const palette = pick(rng, palettes);
  const accent = pick(rng, palette.slice(1));
  const secondary = pick(rng, palette.slice(1));
  const patternKind = pick(rng, patternKinds);
  const gradientId = `coverGradient${index}`;
  const filterId = `paperNoise${index}`;
  const titleLines = wrapText(title, 17);
  const artistLines = wrapText(artist, 24);
  const titleY = pick(rng, [92, 356, 414]);
  const titleSize = titleLines.length > 2 ? 48 : titleLines.length > 1 ? 58 : 68;
  const shapes: string[] = [];

  for (let shapeIndex = 0; shapeIndex < 16; shapeIndex += 1) {
    const x = randomInt(rng, -60, 640);
    const y = randomInt(rng, -60, 640);
    const radius = randomInt(rng, 22, 132);
    const opacity = (0.1 + randomFloat(rng) * 0.35).toFixed(2);
    const fill = pick(rng, palette.slice(1));
    const sides = randomInt(rng, 3, 8);
    const rotation = randomFloat(rng) * Math.PI;

    if (shapeIndex % 3 === 0) {
      shapes.push(
        `<circle cx="${x}" cy="${y}" r="${radius}" fill="none" stroke="${fill}" stroke-width="${randomInt(
          rng,
          3,
          14,
        )}" opacity="${opacity}" />`,
      );
    } else {
      shapes.push(
        `<polygon points="${polygonPoints(x, y, radius, sides, rotation)}" fill="${fill}" opacity="${opacity}" />`,
      );
    }
  }

  const pattern = buildPattern(patternKind, rng, palette, accent, secondary);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="640" viewBox="0 0 640 640" role="img" aria-label="${escapeXml(
    `${title} by ${artist}`,
  )}">
  <defs>
    <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${palette[0]}" />
      <stop offset="55%" stop-color="${accent}" />
      <stop offset="100%" stop-color="${secondary}" />
    </linearGradient>
    <filter id="${filterId}" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="${randomInt(rng, 1, 999)}" result="noise" />
      <feColorMatrix type="saturate" values="0" />
      <feComponentTransfer>
        <feFuncA type="table" tableValues="0 0.12" />
      </feComponentTransfer>
      <feBlend mode="soft-light" in2="SourceGraphic" />
    </filter>
  </defs>
  <rect width="640" height="640" fill="url(#${gradientId})" />
  <g filter="url(#${filterId})">${pattern}</g>
  <g>${shapes.join('')}</g>
  <rect x="34" y="34" width="572" height="572" rx="34" fill="none" stroke="${palette[3]}" stroke-width="2" opacity="0.34" />
  <rect x="56" y="${Math.max(54, titleY - 62)}" width="528" height="${titleLines.length * titleSize + 132}" rx="22" fill="#000000" opacity="0.28" />
  ${textBlock(titleLines, 76, titleY, titleSize, palette[3], 850)}
  ${textBlock(artistLines, 76, titleY + titleLines.slice(0, 3).length * titleSize * 1.08 + 32, 26, palette[3], 650)}
  <text x="76" y="574" font-family="Inter, ui-sans-serif, system-ui, sans-serif" font-size="18" font-weight="700" fill="${palette[3]}" opacity="0.82">${escapeXml(
    genre.toUpperCase(),
  )}</text>
  <circle cx="556" cy="558" r="28" fill="${accent}" opacity="0.8" />
  <circle cx="556" cy="558" r="12" fill="${palette[3]}" opacity="0.9" />
</svg>`;
}
