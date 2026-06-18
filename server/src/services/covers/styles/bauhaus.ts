import type { CoverRenderContext } from '../coverTypes.js';
import { renderWaveform } from '../motifs.js';
import { grainFilter, textureIds } from '../textures.js';
import { displayFamily, renderArtistLabel, renderMetaText, renderTitleBlock } from '../typography.js';
import { circle, group, line, rect, svg } from '../svgHelpers.js';

export function renderBauhaus(ctx: CoverRenderContext): string {
  const ids = textureIds(ctx, 'bauhaus');
  const grain = grainFilter(ids.grain, ctx, 0.07);
  const dotGrid = Array.from({ length: 48 }, (_, index) => {
    const col = index % 8;
    const row = Math.floor(index / 8);
    return circle({ cx: 520 + col * 22, cy: 92 + row * 22, r: 5, fill: ctx.palette.primary, opacity: 0.42 });
  }).join('');
  const label = `${ctx.song.title} by ${ctx.song.artist}`;

  const body = [
    rect({ x: 0, y: 0, width: ctx.width, height: ctx.height, fill: ctx.palette.background }),
    rect({ x: 72, y: 72, width: 656, height: 656, fill: 'none', stroke: ctx.palette.primary, 'stroke-width': 3 }),
    line({ x1: 72, y1: 320, x2: 728, y2: 320, stroke: ctx.palette.primary, 'stroke-width': 3 }),
    line({ x1: 320, y1: 72, x2: 320, y2: 728, stroke: ctx.palette.primary, 'stroke-width': 3 }),
    circle({ cx: 198, cy: 198, r: 126, fill: ctx.palette.accent }),
    rect({ x: 320, y: 72, width: 408, height: 248, fill: ctx.palette.secondary, opacity: 0.78 }),
    rect({ x: 72, y: 320, width: 248, height: 408, fill: ctx.palette.primary, opacity: 0.95 }),
    circle({ cx: 604, cy: 604, r: 155, fill: ctx.palette.primary, opacity: 0.18 }),
    rect({ x: 370, y: 360, width: 330, height: 58, fill: ctx.palette.accent, transform: 'rotate(-24 535 389)' }),
    dotGrid,
    group(renderWaveform(ctx, 370, 520, 310, 110), { opacity: 0.7 }),
    renderMetaText('FORM / SOUND / SERIES', { x: 104, y: 104, size: 14, fill: ctx.palette.text }, ctx),
    renderTitleBlock(ctx, { x: 104, y: 430, size: 42, maxChars: 10, maxLines: 3, fill: ctx.palette.background, family: displayFamily, uppercase: true, lineHeight: 46 }),
    renderArtistLabel(ctx, { x: 706, y: 704, size: 17, anchor: 'end', fill: ctx.palette.primary, letterSpacing: 3 }),
    renderMetaText(`${ctx.song.genre} ${String(ctx.song.index).padStart(3, '0')}`, { x: 706, y: 294, size: 14, anchor: 'end', fill: ctx.palette.text }, ctx),
    grain.overlay,
  ];

  return svg(ctx.width, ctx.height, grain.defs, body, label);
}
