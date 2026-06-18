import type { CoverRenderContext } from '../coverTypes.js';
import { renderMoonClouds, renderMountainLandscape, renderTopographicLines } from '../motifs.js';
import { grainFilter, softBlurFilter, textureIds } from '../textures.js';
import { renderArtistLabel, renderMetaText, renderTitleBlock, serifFamily } from '../typography.js';
import { circle, group, pick, randomInt, rect, svg } from '../svgHelpers.js';

export function renderAmbient(ctx: CoverRenderContext): string {
  const ids = textureIds(ctx, 'ambient');
  const grain = grainFilter(ids.grain, ctx, 0.08);
  const motif = pick(ctx.rng, [
    () => renderMoonClouds(ctx),
    () => renderMountainLandscape(ctx),
    () => renderTopographicLines(ctx, 410, 360, 310),
  ])();
  const softCircles = Array.from({ length: 9 }, (_, index) =>
    circle({
      cx: randomInt(ctx.rng, 60, 740),
      cy: randomInt(ctx.rng, 70, 620),
      r: randomInt(ctx.rng, 70, 190),
      fill: index % 2 === 0 ? ctx.palette.accent : ctx.palette.secondary,
      opacity: 0.09,
      filter: `url(#${ids.blur})`,
    }),
  ).join('');
  const defs = [
    grain.defs,
    softBlurFilter(ids.blur, 22),
    `<linearGradient id="${ids.glow}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${ctx.palette.background}" /><stop offset="55%" stop-color="${ctx.palette.primary}" /><stop offset="100%" stop-color="${ctx.palette.secondary}" /></linearGradient>`,
  ];
  const label = `${ctx.song.title} by ${ctx.song.artist}`;

  const body = [
    rect({ x: 0, y: 0, width: ctx.width, height: ctx.height, fill: `url(#${ids.glow})` }),
    softCircles,
    group(motif, { opacity: 0.74 }),
    rect({ x: 60, y: 60, width: 680, height: 680, fill: 'none', stroke: ctx.palette.text, 'stroke-width': 1.5, opacity: 0.22 }),
    renderArtistLabel(ctx, { x: 92, y: 112, size: 15, fill: ctx.palette.muted, letterSpacing: 5 }),
    renderTitleBlock(ctx, { x: 92, y: 650, size: 42, maxChars: 25, maxLines: 2, fill: ctx.palette.text, family: serifFamily, weight: 560, lineHeight: 46 }),
    renderMetaText(`${ctx.song.genre} / ${ctx.song.locale}`, { x: 92, y: 714, size: 13, fill: ctx.palette.muted }, ctx),
    grain.overlay,
  ];

  return svg(ctx.width, ctx.height, defs, body, label);
}
