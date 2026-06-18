import type { CoverRenderContext } from './coverTypes.js';
import { escapeXml } from './svgHelpers.js';

type TitleOptions = {
  x: number;
  y: number;
  size: number;
  maxChars: number;
  maxLines?: number;
  fill?: string;
  anchor?: 'start' | 'middle' | 'end';
  family?: string;
  weight?: number;
  uppercase?: boolean;
  lineHeight?: number;
  letterSpacing?: number;
  transform?: string;
};

type LabelOptions = {
  x: number;
  y: number;
  size?: number;
  fill?: string;
  anchor?: 'start' | 'middle' | 'end';
  family?: string;
  weight?: number;
  uppercase?: boolean;
  letterSpacing?: number;
  transform?: string;
};

export const sansFamily = 'Inter, Arial, sans-serif';
export const serifFamily = 'Georgia, serif';
export const displayFamily = "'Arial Black', Impact, sans-serif";
export const monoFamily = "'Courier New', monospace";

function splitLongWord(word: string, maxChars: number): string[] {
  if (word.length <= maxChars) {
    return [word];
  }

  const chunks: string[] = [];
  for (let index = 0; index < word.length; index += maxChars) {
    chunks.push(word.slice(index, index + maxChars));
  }
  return chunks;
}

function wrapAtWidth(text: string, maxCharsPerLine: number): string[] {
  const words = text
    .split(/\s+/)
    .filter(Boolean)
    .flatMap((word) => splitLongWord(word, maxCharsPerLine));
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const candidate = current.length > 0 ? `${current} ${word}` : word;

    if (candidate.length > maxCharsPerLine && current.length > 0) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }

  if (current.length > 0) {
    lines.push(current);
  }

  return lines.length > 0 ? lines : [text];
}

export function wrapText(text: string, maxCharsPerLine: number, maxLines: number): string[] {
  const maximumWidth = Math.max(maxCharsPerLine, text.length);

  for (let width = maxCharsPerLine; width <= maximumWidth; width += 1) {
    const lines = wrapAtWidth(text, width);

    if (lines.length <= maxLines) {
      return lines;
    }
  }

  return wrapAtWidth(text, maximumWidth);
}

export function smartUppercase(value: string): string {
  return value.toLocaleUpperCase();
}

export function renderTitleBlock(ctx: CoverRenderContext, options: TitleOptions): string {
  const title = options.uppercase ? smartUppercase(ctx.song.title) : ctx.song.title;
  const lines = wrapText(title, options.maxChars, options.maxLines ?? 3);
  const lineHeight = options.lineHeight ?? options.size * 1.04;
  const transform = options.transform ? ` transform="${escapeXml(options.transform)}"` : '';
  const tspans = lines
    .map((line, index) => `<tspan x="${options.x}" dy="${index === 0 ? 0 : lineHeight}">${escapeXml(line)}</tspan>`)
    .join('');

  return `<text x="${options.x}" y="${options.y}" font-family="${options.family ?? sansFamily}" font-size="${options.size}" font-weight="${options.weight ?? 850}" fill="${options.fill ?? ctx.palette.text}" text-anchor="${options.anchor ?? 'start'}" letter-spacing="${options.letterSpacing ?? 0}"${transform}>${tspans}</text>`;
}

export function renderArtistLabel(ctx: CoverRenderContext, options: LabelOptions): string {
  const value = options.uppercase === false ? ctx.song.artist : smartUppercase(ctx.song.artist);
  const transform = options.transform ? ` transform="${escapeXml(options.transform)}"` : '';

  return `<text x="${options.x}" y="${options.y}" font-family="${options.family ?? sansFamily}" font-size="${options.size ?? 22}" font-weight="${options.weight ?? 760}" fill="${options.fill ?? ctx.palette.muted}" text-anchor="${options.anchor ?? 'start'}" letter-spacing="${options.letterSpacing ?? 2}"${transform}>${escapeXml(value)}</text>`;
}

export function renderMetaText(value: string, options: LabelOptions, ctx: CoverRenderContext): string {
  const transform = options.transform ? ` transform="${escapeXml(options.transform)}"` : '';

  return `<text x="${options.x}" y="${options.y}" font-family="${options.family ?? monoFamily}" font-size="${options.size ?? 15}" font-weight="${options.weight ?? 700}" fill="${options.fill ?? ctx.palette.muted}" text-anchor="${options.anchor ?? 'start'}" letter-spacing="${options.letterSpacing ?? 1}"${transform}>${escapeXml(value)}</text>`;
}
