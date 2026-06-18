import type { CoverRenderContext } from '../coverTypes.js';
import { renderCitySkyline, renderMoonClouds, renderSpeakerStack, renderTopographicLines, renderWaveform } from '../motifs.js';
import { glowFilter, scanlinePattern, textureIds } from '../textures.js';
import { displayFamily, renderArtistLabel, renderMetaText, renderTitleBlock } from '../typography.js';
import { circle, group, line, path, pick, rect, svg } from '../svgHelpers.js';

export function renderNeon(ctx: CoverRenderContext): string {
  const ids = textureIds(ctx, 'neon');
  const scanlines = scanlinePattern(ids.scanline, ctx, 8);
  const motif = pick(ctx.rng, [
    () => renderCitySkyline(ctx, 510),
    () => renderWaveform(ctx, 90, 332, 620, 180),
    () => renderSpeakerStack(ctx, 212, 225, 376, 300),
    () => renderMoonClouds(ctx),
    () => renderTopographicLines(ctx, 400, 360, 260),
  ])();
  const label = `${ctx.song.title} by ${ctx.song.artist}`;

  const grid = Array.from({ length: 13 }, (_, index) => {
    const y = 430 + index * 22;
    return line({ x1: 0, y1: y, x2: 800, y2: y + index * 15, stroke: ctx.palette.secondary, 'stroke-width': 1, opacity: 0.22 });
  }).join('');

  const rays = Array.from({ length: 17 }, (_, index) =>
    line({
      x1: 400,
      y1: 472,
      x2: 40 + index * 45,
      y2: 800,
      stroke: ctx.palette.secondary,
      'stroke-width': 1.2,
      opacity: 0.18,
    }),
  ).join('');

  const defs = [
    `<radialGradient id="${ids.blur}" cx="50%" cy="40%" r="75%"><stop offset="0%" stop-color="${ctx.palette.primary}" /><stop offset="52%" stop-color="${ctx.palette.background}" /><stop offset="100%" stop-color="#000000" /></radialGradient>`,
    glowFilter(ids.glow, 9),
    scanlines.defs,
  ];

  const body = [
    rect({ x: 0, y: 0, width: ctx.width, height: ctx.height, fill: `url(#${ids.blur})` }),
    group([circle({ cx: 400, cy: 320, r: 190, fill: 'none', stroke: ctx.palette.accent, 'stroke-width': 10, opacity: 0.85 }), circle({ cx: 400, cy: 320, r: 128, fill: 'none', stroke: ctx.palette.secondary, 'stroke-width': 4, opacity: 0.72 })], { filter: `url(#${ids.glow})` }),
    path({ d: 'M 0 545 C 155 455, 238 612, 390 526 S 625 440, 800 520 L 800 800 L 0 800 Z', fill: ctx.palette.primary, opacity: 0.44 }),
    grid,
    rays,
    group(motif, { filter: `url(#${ids.glow})`, opacity: 0.92 }),
    rect({ x: 58, y: 58, width: 684, height: 684, fill: 'none', stroke: ctx.palette.accent, 'stroke-width': 2, opacity: 0.7 }),
    renderTitleBlock(ctx, { x: 78, y: 116, size: 51, maxChars: 17, maxLines: 2, fill: ctx.palette.text, family: displayFamily, uppercase: true, lineHeight: 55, letterSpacing: 1 }),
    renderArtistLabel(ctx, { x: 82, y: 210, size: 18, fill: ctx.palette.accent, letterSpacing: 4 }),
    renderMetaText(`STEREO ${ctx.song.genre}`, { x: 718, y: 718, size: 14, anchor: 'end', fill: ctx.palette.text }, ctx),
    scanlines.overlay,
  ];

  return svg(ctx.width, ctx.height, defs, body, label);
}
