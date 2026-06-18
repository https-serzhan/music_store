import type { CoverRenderContext } from '../coverTypes.js';
import { renderBotanical, renderCassette, renderSpeakerStack } from '../motifs.js';
import { paperTexture, grainFilter, textureIds } from '../textures.js';
import { displayFamily, renderArtistLabel, renderMetaText, renderTitleBlock } from '../typography.js';
import { circle, group, pick, points, polygon, randomInt, rect, svg } from '../svgHelpers.js';

export function renderCollage(ctx: CoverRenderContext): string {
  const ids = textureIds(ctx, 'collage');
  const grain = grainFilter(ids.grain, ctx, 0.09);
  const motif = pick(ctx.rng, [
    () => renderCassette(ctx, 170, 255, 460, 260),
    () => renderSpeakerStack(ctx, 230, 225, 340, 340),
    () => renderBotanical(ctx, 145, 595, 360),
  ])();
  const papers = Array.from({ length: 7 }, (_, index) => {
    const x = randomInt(ctx.rng, 55, 510);
    const y = randomInt(ctx.rng, 90, 540);
    const width = randomInt(ctx.rng, 160, 330);
    const height = randomInt(ctx.rng, 90, 210);
    const rotate = randomInt(ctx.rng, -12, 12);
    const fill = index % 3 === 0 ? ctx.palette.accent : index % 3 === 1 ? ctx.palette.secondary : ctx.palette.text;

    return rect({ x, y, width, height, rx: 3, fill, opacity: index % 3 === 2 ? 0.82 : 0.74, transform: `rotate(${rotate} ${x + width / 2} ${y + height / 2})` });
  }).join('');
  const label = `${ctx.song.title} by ${ctx.song.artist}`;

  const body = [
    rect({ x: 0, y: 0, width: ctx.width, height: ctx.height, fill: ctx.palette.background }),
    paperTexture(ctx),
    polygon({ points: points([[0, 130], [800, 0], [800, 182], [0, 320]]), fill: ctx.palette.secondary, opacity: 0.42 }),
    polygon({ points: points([[0, 650], [800, 482], [800, 800], [0, 800]]), fill: ctx.palette.primary, opacity: 0.9 }),
    papers,
    group(motif, { transform: 'rotate(-3 400 400)' }),
    rect({ x: 82, y: 86, width: 250, height: 58, rx: 29, fill: ctx.palette.text, opacity: 0.92 }),
    renderMetaText(`SIDE A  ${String(ctx.song.index).padStart(3, '0')}`, { x: 110, y: 123, size: 17, fill: ctx.palette.background }, ctx),
    circle({ cx: 660, cy: 150, r: 72, fill: ctx.palette.accent, opacity: 0.96 }),
    renderMetaText('NEW', { x: 660, y: 158, size: 24, anchor: 'middle', fill: ctx.palette.text, family: displayFamily }, ctx),
    rect({ x: 74, y: 572, width: 652, height: 142, rx: 10, fill: ctx.palette.text, opacity: 0.94, transform: 'rotate(-2 400 643)' }),
    renderTitleBlock(ctx, { x: 112, y: 630, size: 42, maxChars: 22, maxLines: 2, fill: ctx.palette.background, family: displayFamily, uppercase: true, lineHeight: 45, transform: 'rotate(-2 400 643)' }),
    renderArtistLabel(ctx, { x: 114, y: 722, size: 18, fill: ctx.palette.accent, letterSpacing: 3 }),
    grain.overlay,
  ];

  return svg(ctx.width, ctx.height, grain.defs, body, label);
}
