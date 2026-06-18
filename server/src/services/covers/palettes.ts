import type { CoverPalette, CoverStyle } from './coverTypes.js';
import { pick } from './svgHelpers.js';
import type { Rng } from '../../utils/rng.js';

export const palettes: CoverPalette[] = [
  { name: 'midnight-cyan', background: '#0B132B', primary: '#1C2541', secondary: '#3A506B', accent: '#5BC0BE', text: '#F4F7F5', muted: '#B8C5D6' },
  { name: 'paper-red', background: '#F2E9DC', primary: '#403D39', secondary: '#CCC5B9', accent: '#EB5E28', text: '#252422', muted: '#7A736B' },
  { name: 'neon-night', background: '#070011', primary: '#25105A', secondary: '#00F5D4', accent: '#F15BB5', text: '#FFFFFF', muted: '#9B8ABB' },
  { name: 'club-green', background: '#02111B', primary: '#0B4F6C', secondary: '#01BAEF', accent: '#7CFFCB', text: '#F7FFF7', muted: '#98C1D9' },
  { name: 'oxide', background: '#2B2118', primary: '#6F1D1B', secondary: '#BB9457', accent: '#FFE6A7', text: '#FFF8E8', muted: '#C9A66B' },
  { name: 'lilac-static', background: '#120A2A', primary: '#3D1766', secondary: '#6F2DBD', accent: '#F7AEF8', text: '#FBF7FF', muted: '#C8B6FF' },
  { name: 'sun-print', background: '#FFF3B0', primary: '#335C67', secondary: '#E09F3E', accent: '#9E2A2B', text: '#1D2D2F', muted: '#6E6A51' },
  { name: 'blue-note', background: '#EEF4ED', primary: '#134074', secondary: '#13315C', accent: '#0B2545', text: '#0B1D2A', muted: '#64748B' },
  { name: 'rose-paper', background: '#F7DAD9', primary: '#8E4162', secondary: '#F2A7A5', accent: '#D81159', text: '#31111D', muted: '#8B5D6B' },
  { name: 'deep-space', background: '#050505', primary: '#151515', secondary: '#8338EC', accent: '#3A86FF', text: '#FFFFFF', muted: '#A7A7A7' },
  { name: 'acid-pop', background: '#F7FF00', primary: '#FF206E', secondary: '#41EAD4', accent: '#FBFF12', text: '#0C0C0C', muted: '#4A4A4A' },
  { name: 'forest-tape', background: '#E9EDC9', primary: '#606C38', secondary: '#283618', accent: '#BC6C25', text: '#1E2414', muted: '#7A7D55' },
  { name: 'mono-ink', background: '#F8F9FA', primary: '#212529', secondary: '#ADB5BD', accent: '#E63946', text: '#111111', muted: '#6C757D' },
  { name: 'dusk-orange', background: '#221219', primary: '#592941', secondary: '#B85042', accent: '#F2A65A', text: '#FFF6E8', muted: '#D9A5A5' },
  { name: 'aqua-paper', background: '#E0FBFC', primary: '#293241', secondary: '#98C1D9', accent: '#EE6C4D', text: '#1B263B', muted: '#5C7080' },
  { name: 'purple-heat', background: '#10002B', primary: '#240046', secondary: '#5A189A', accent: '#FF8500', text: '#FFF9EC', muted: '#C77DFF' },
  { name: 'mint-soul', background: '#F1FAEE', primary: '#457B9D', secondary: '#A8DADC', accent: '#E63946', text: '#1D3557', muted: '#6A8E9A' },
  { name: 'sepia-club', background: '#EDE0D4', primary: '#7F5539', secondary: '#B08968', accent: '#9C6644', text: '#2F2118', muted: '#8D7B68' },
  { name: 'cyan-magenta', background: '#050A30', primary: '#000C66', secondary: '#00FFFF', accent: '#FF00E4', text: '#FFFFFF', muted: '#8DEBFF' },
  { name: 'cream-jazz', background: '#F5F1E6', primary: '#1F2937', secondary: '#D6A65A', accent: '#8A1538', text: '#101820', muted: '#7E7465' },
  { name: 'signal-red', background: '#151515', primary: '#2D2D2D', secondary: '#D00000', accent: '#FFD500', text: '#FFFFFF', muted: '#B7B7B7' },
  { name: 'alpine', background: '#EAF4F4', primary: '#006D77', secondary: '#83C5BE', accent: '#E29578', text: '#1F363D', muted: '#6B9080' },
  { name: 'night-gold', background: '#090809', primary: '#1C1B1A', secondary: '#AA8F66', accent: '#EDC967', text: '#FFF8E1', muted: '#B8A88A' },
  { name: 'skyline-pink', background: '#151E3F', primary: '#030027', secondary: '#F72585', accent: '#4CC9F0', text: '#FFFFFF', muted: '#BDE0FE' },
  { name: 'desert-film', background: '#F4EBD0', primary: '#7D4F50', secondary: '#D9A441', accent: '#2D728F', text: '#33241F', muted: '#8F7A5E' },
  { name: 'teal-static', background: '#001219', primary: '#005F73', secondary: '#0A9396', accent: '#EE9B00', text: '#E9D8A6', muted: '#94D2BD' },
  { name: 'strawberry-milk', background: '#FFE5EC', primary: '#FB6F92', secondary: '#FFB3C6', accent: '#8338EC', text: '#371B34', muted: '#8A6877' },
  { name: 'industrial', background: '#202020', primary: '#3F3F37', secondary: '#6F732F', accent: '#F7CB15', text: '#F6F4E6', muted: '#B7B7A4' },
  { name: 'cold-wave', background: '#0A1128', primary: '#001F54', secondary: '#034078', accent: '#1282A2', text: '#FEFCFB', muted: '#A9D6E5' },
  { name: 'orchid-print', background: '#F7F0F5', primary: '#432371', secondary: '#714674', accent: '#D90368', text: '#220C10', muted: '#8E7D8B' },
  { name: 'lava-lamp', background: '#230903', primary: '#621708', secondary: '#941B0C', accent: '#F6AA1C', text: '#FFF3B0', muted: '#C38E70' },
  { name: 'spruce', background: '#DAD7CD', primary: '#344E41', secondary: '#588157', accent: '#A3B18A', text: '#1B2A20', muted: '#6C7C66' },
  { name: 'ultraviolet', background: '#05010A', primary: '#1B0738', secondary: '#5F0F40', accent: '#00F5D4', text: '#FFFFFF', muted: '#CDB4DB' },
  { name: 'newsprint', background: '#F1E9DB', primary: '#191716', secondary: '#B6AD90', accent: '#D45D31', text: '#191716', muted: '#756F63' },
];

const darkNames = new Set(['midnight-cyan', 'neon-night', 'club-green', 'lilac-static', 'deep-space', 'purple-heat', 'cyan-magenta', 'signal-red', 'night-gold', 'skyline-pink', 'teal-static', 'industrial', 'cold-wave', 'lava-lamp', 'ultraviolet']);
const paperNames = new Set(['paper-red', 'sun-print', 'blue-note', 'rose-paper', 'forest-tape', 'mono-ink', 'aqua-paper', 'mint-soul', 'sepia-club', 'cream-jazz', 'alpine', 'desert-film', 'strawberry-milk', 'orchid-print', 'spruce', 'newsprint']);
const brightNames = new Set(['acid-pop', 'sun-print', 'rose-paper', 'cyan-magenta', 'strawberry-milk', 'orchid-print', 'skyline-pink', 'mint-soul']);

function genreSuggestsBright(genre: string): boolean {
  const value = genre.toLowerCase();
  return value.includes('pop') || value.includes('dance') || value.includes('funk') || value.includes('disco');
}

export function pickPalette(rng: Rng, genre: string, style: CoverStyle): CoverPalette {
  let pool = palettes;

  if (style === 'neon' || style === 'glitch') {
    pool = palettes.filter((palette) => darkNames.has(palette.name));
  } else if (style === 'vintage' || style === 'editorial') {
    pool = palettes.filter((palette) => paperNames.has(palette.name));
  } else if (style === 'collage' || style === 'bauhaus' || genreSuggestsBright(genre)) {
    pool = palettes.filter((palette) => brightNames.has(palette.name) || paperNames.has(palette.name));
  } else if (style === 'ambient' || style === 'silhouette') {
    pool = palettes.filter((palette) => darkNames.has(palette.name) || paperNames.has(palette.name));
  }

  return pick(rng, pool.length > 0 ? pool : palettes);
}
