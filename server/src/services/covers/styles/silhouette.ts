import type { CoverRenderContext } from '../coverTypes.js';
import { renderAbstractPortrait, renderCitySkyline, renderMoonClouds, renderMountainLandscape, renderSpeakerStack } from '../motifs.js';
import { grainFilter, textureIds } from '../textures.js';
import { displayFamily, renderArtistLabel, renderMetaText, renderTitleBlock } from '../typography.js';
import { group, pick, rect, svg } from '../svgHelpers.js';

export function renderSilhouette(ctx: CoverRenderContext): string {
  const ids = textureIds(ctx, 'silhouette');
  const grain = grainFilter(ids.grain, ctx, 0.08);
  const motif = pick(ctx.rng, [
    () => renderMountainLandscape(ctx),
    () => renderCitySkyline(ctx, 560),
    () => renderSpeakerStack(ctx, 218, 210, 364, 364),
    () => renderAbstractPortrait(ctx, 285, 140, 1.25),
    () => renderMoonClouds(ctx),
  ])();
  const label = `${ctx.song.title} by ${ctx.song.artist}`;

  const body = [
    rect({ x: 0, y: 0, width: ctx.width, height: ctx.height, fill: ctx.palette.background }),
    rect({ x: 0, y: 0, width: ctx.width, height: 430, fill: ctx.palette.secondary, opacity: 0.28 }),
    group(motif, { opacity: 0.9 }),
    rect({ x: 0, y: 550, width: ctx.width, height: 250, fill: ctx.palette.primary, opacity: 0.95 }),
    rect({ x: 54, y: 54, width: 692, height: 692, fill: 'none', stroke: ctx.palette.text, 'stroke-width': 2, opacity: 0.54 }),
    renderMetaText(`${ctx.song.genre} / ${ctx.song.locale}`, { x: 82, y: 98, size: 14, fill: ctx.palette.text }, ctx),
    renderTitleBlock(ctx, { x: 82, y: 635, size: 46, maxChars: 20, maxLines: 2, fill: ctx.palette.text, family: displayFamily, uppercase: true, lineHeight: 49 }),
    renderArtistLabel(ctx, { x: 82, y: 726, size: 18, fill: ctx.palette.accent, letterSpacing: 4 }),
    grain.overlay,
  ];

  return svg(ctx.width, ctx.height, grain.defs, body, label);
}
