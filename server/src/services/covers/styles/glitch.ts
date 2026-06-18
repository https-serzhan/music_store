import type { CoverRenderContext } from '../coverTypes.js';
import { renderCitySkyline, renderTopographicLines, renderWaveform } from '../motifs.js';
import { grainFilter, halftonePattern, scanlinePattern, scratchOverlay, textureIds } from '../textures.js';
import { monoFamily, renderArtistLabel, renderMetaText, renderTitleBlock } from '../typography.js';
import { group, line, pick, randomInt, rect, svg } from '../svgHelpers.js';

export function renderGlitch(ctx: CoverRenderContext): string {
  const ids = textureIds(ctx, 'glitch');
  const grain = grainFilter(ids.grain, ctx, 0.12);
  const dots = halftonePattern(ids.halftone, ctx, 16, 0.12);
  const scanlines = scanlinePattern(ids.scanline, ctx, 7);
  const motif = pick(ctx.rng, [
    () => renderWaveform(ctx, 96, 345, 608, 145),
    () => renderCitySkyline(ctx, 505),
    () => renderTopographicLines(ctx, 400, 375, 255),
  ])();
  const slices = Array.from({ length: 18 }, () => {
    const y = randomInt(ctx.rng, 118, 604);
    const h = randomInt(ctx.rng, 8, 34);
    const offset = randomInt(ctx.rng, -52, 52);
    return rect({ x: 86 + offset, y, width: 628, height: h, fill: pick(ctx.rng, [ctx.palette.accent, ctx.palette.secondary, ctx.palette.text]), opacity: 0.18 });
  }).join('');
  const label = `${ctx.song.title} by ${ctx.song.artist}`;

  const body = [
    rect({ x: 0, y: 0, width: ctx.width, height: ctx.height, fill: ctx.palette.background }),
    rect({ x: 82, y: 118, width: 636, height: 462, fill: ctx.palette.primary, opacity: 0.84 }),
    group(motif, { opacity: 0.8 }),
    slices,
    group(renderTitleBlock(ctx, { x: 76, y: 116, size: 48, maxChars: 18, maxLines: 2, fill: ctx.palette.accent, family: monoFamily, uppercase: true, lineHeight: 51 }), { transform: 'translate(-5 0)', opacity: 0.55 }),
    group(renderTitleBlock(ctx, { x: 76, y: 116, size: 48, maxChars: 18, maxLines: 2, fill: ctx.palette.secondary, family: monoFamily, uppercase: true, lineHeight: 51 }), { transform: 'translate(5 3)', opacity: 0.5 }),
    renderTitleBlock(ctx, { x: 76, y: 116, size: 48, maxChars: 18, maxLines: 2, fill: ctx.palette.text, family: monoFamily, uppercase: true, lineHeight: 51 }),
    renderArtistLabel(ctx, { x: 82, y: 665, size: 18, fill: ctx.palette.accent, family: monoFamily, letterSpacing: 2 }),
    renderMetaText(`ERR_${String(ctx.song.index).padStart(4, '0')} ${ctx.song.genre}`, { x: 82, y: 710, size: 14, fill: ctx.palette.muted, family: monoFamily }, ctx),
    line({ x1: 82, y1: 692, x2: 718, y2: 692, stroke: ctx.palette.secondary, 'stroke-width': 2, opacity: 0.5 }),
    scratchOverlay(ctx, 22),
    dots.overlay,
    scanlines.overlay,
    grain.overlay,
  ];

  return svg(ctx.width, ctx.height, [grain.defs, dots.defs, scanlines.defs], body, label);
}
