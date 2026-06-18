import type { CoverRenderContext } from '../coverTypes.js';
import { renderAbstractPortrait, renderBotanical, renderTopographicLines, renderVinylRecord } from '../motifs.js';
import { paperTexture, grainFilter, textureIds } from '../textures.js';
import { renderArtistLabel, renderMetaText, renderTitleBlock, serifFamily } from '../typography.js';
import { group, line, pick, rect, svg } from '../svgHelpers.js';

export function renderEditorial(ctx: CoverRenderContext): string {
  const ids = textureIds(ctx, 'editorial');
  const grain = grainFilter(ids.grain, ctx, 0.1);
  const motif = pick(ctx.rng, [
    () => renderVinylRecord(ctx, 400, 295, 176),
    () => renderBotanical(ctx, 170, 548, 360),
    () => renderAbstractPortrait(ctx, 286, 132, 1.05),
    () => renderTopographicLines(ctx, 405, 300, 210),
  ])();
  const label = `${ctx.song.title} by ${ctx.song.artist}`;

  const body = [
    rect({ x: 0, y: 0, width: ctx.width, height: ctx.height, fill: ctx.palette.background }),
    paperTexture(ctx),
    rect({ x: 46, y: 46, width: 708, height: 708, fill: 'none', stroke: ctx.palette.primary, 'stroke-width': 2, opacity: 0.65 }),
    line({ x1: 90, y1: 116, x2: 710, y2: 116, stroke: ctx.palette.primary, 'stroke-width': 1, opacity: 0.35 }),
    line({ x1: 90, y1: 600, x2: 710, y2: 600, stroke: ctx.palette.primary, 'stroke-width': 1, opacity: 0.35 }),
    rect({ x: 112, y: 142, width: 576, height: 380, fill: ctx.palette.secondary, opacity: 0.2 }),
    group(motif, { transform: 'translate(0 0)' }),
    rect({ x: 112, y: 142, width: 576, height: 380, fill: 'none', stroke: ctx.palette.primary, 'stroke-width': 3, opacity: 0.82 }),
    renderArtistLabel(ctx, { x: 112, y: 644, size: 18, fill: ctx.palette.accent, letterSpacing: 3 }),
    renderTitleBlock(ctx, { x: 112, y: 694, size: 45, maxChars: 20, maxLines: 2, fill: ctx.palette.text, family: serifFamily, weight: 760, lineHeight: 48 }),
    renderMetaText(`${ctx.song.genre} / CAT ${String(ctx.song.index).padStart(4, '0')}`, { x: 690, y: 644, size: 13, anchor: 'end', fill: ctx.palette.muted }, ctx),
    grain.overlay,
  ];

  return svg(ctx.width, ctx.height, grain.defs, body, label);
}
