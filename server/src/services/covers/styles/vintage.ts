import type { CoverRenderContext } from '../coverTypes.js';
import { renderBotanical, renderCassette, renderMountainLandscape, renderVinylRecord } from '../motifs.js';
import { grainFilter, paperTexture, scratchOverlay, textureIds } from '../textures.js';
import { renderArtistLabel, renderMetaText, renderTitleBlock, serifFamily } from '../typography.js';
import { group, pick, rect, svg } from '../svgHelpers.js';

export function renderVintage(ctx: CoverRenderContext): string {
  const ids = textureIds(ctx, 'vintage');
  const grain = grainFilter(ids.grain, ctx, 0.16);
  const motif = pick(ctx.rng, [
    () => renderVinylRecord(ctx, 400, 355, 205),
    () => group(renderMountainLandscape(ctx), { 'clip-path': `url(#${ids.blur})` }),
    () => renderBotanical(ctx, 135, 595, 380),
    () => renderCassette(ctx, 150, 290, 500, 270),
  ])();
  const defs = [
    grain.defs,
    `<clipPath id="${ids.blur}">${rect({ x: 120, y: 190, width: 560, height: 355, rx: 8 })}</clipPath>`,
  ];
  const label = `${ctx.song.title} by ${ctx.song.artist}`;

  const body = [
    rect({ x: 0, y: 0, width: ctx.width, height: ctx.height, fill: ctx.palette.background }),
    paperTexture(ctx),
    rect({ x: 48, y: 48, width: 704, height: 704, fill: 'none', stroke: ctx.palette.primary, 'stroke-width': 10, opacity: 0.82 }),
    rect({ x: 72, y: 72, width: 656, height: 656, fill: 'none', stroke: ctx.palette.secondary, 'stroke-width': 2, opacity: 0.72 }),
    rect({ x: 118, y: 188, width: 564, height: 360, fill: ctx.palette.secondary, opacity: 0.2 }),
    motif,
    rect({ x: 118, y: 188, width: 564, height: 360, fill: 'none', stroke: ctx.palette.primary, 'stroke-width': 3, opacity: 0.7 }),
    renderMetaText('MONO / LONG PLAY', { x: 118, y: 126, size: 15, fill: ctx.palette.accent }, ctx),
    renderMetaText(`NO. ${String(ctx.song.index).padStart(5, '0')}`, { x: 682, y: 126, size: 15, anchor: 'end', fill: ctx.palette.muted }, ctx),
    renderTitleBlock(ctx, { x: 400, y: 628, size: 48, maxChars: 18, maxLines: 2, fill: ctx.palette.text, family: serifFamily, anchor: 'middle', weight: 800, lineHeight: 50 }),
    renderArtistLabel(ctx, { x: 400, y: 718, size: 18, anchor: 'middle', fill: ctx.palette.primary, letterSpacing: 4 }),
    scratchOverlay(ctx, 35),
    grain.overlay,
  ];

  return svg(ctx.width, ctx.height, defs, body, label);
}
