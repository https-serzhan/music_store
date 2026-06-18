import type { CoverRenderContext } from './coverTypes.js';
import { circle, ellipse, formatNumber, group, line, path, pick, points, polygon, randomFloat, randomInt, rect } from './svgHelpers.js';

export function renderVinylRecord(ctx: CoverRenderContext, cx: number, cy: number, radius: number): string {
  const grooves = Array.from({ length: 12 }, (_, index) =>
    circle({
      cx,
      cy,
      r: radius * (0.26 + index * 0.052),
      fill: 'none',
      stroke: ctx.palette.muted,
      'stroke-width': index % 3 === 0 ? 2 : 1,
      opacity: index % 3 === 0 ? 0.34 : 0.18,
    }),
  ).join('');

  const highlight = path({
    d: `M ${formatNumber(cx - radius * 0.52)} ${formatNumber(cy - radius * 0.5)} C ${formatNumber(cx - radius * 0.15)} ${formatNumber(cy - radius * 0.75)}, ${formatNumber(cx + radius * 0.38)} ${formatNumber(cy - radius * 0.66)}, ${formatNumber(cx + radius * 0.58)} ${formatNumber(cy - radius * 0.22)}`,
    fill: 'none',
    stroke: ctx.palette.text,
    'stroke-width': radius * 0.04,
    opacity: 0.22,
    'stroke-linecap': 'round',
  });

  return group([
    circle({ cx, cy, r: radius, fill: '#050505', opacity: 0.95 }),
    circle({ cx, cy, r: radius * 0.78, fill: 'none', stroke: ctx.palette.secondary, 'stroke-width': 2, opacity: 0.28 }),
    grooves,
    circle({ cx, cy, r: radius * 0.22, fill: ctx.palette.accent }),
    circle({ cx, cy, r: radius * 0.09, fill: ctx.palette.background, opacity: 0.9 }),
    circle({ cx, cy, r: radius * 0.025, fill: ctx.palette.text, opacity: 0.75 }),
    highlight,
  ]);
}

export function renderCassette(ctx: CoverRenderContext, x: number, y: number, width: number, height: number): string {
  const reelRadius = Math.min(width, height) * 0.15;
  const leftCx = x + width * 0.32;
  const rightCx = x + width * 0.68;
  const cy = y + height * 0.52;
  const screws = [
    [x + 24, y + 24],
    [x + width - 24, y + 24],
    [x + 24, y + height - 24],
    [x + width - 24, y + height - 24],
  ];

  const reel = (cx: number) =>
    group([
      circle({ cx, cy, r: reelRadius, fill: ctx.palette.background, stroke: ctx.palette.primary, 'stroke-width': 8 }),
      circle({ cx, cy, r: reelRadius * 0.55, fill: 'none', stroke: ctx.palette.muted, 'stroke-width': 4, opacity: 0.75 }),
      ...Array.from({ length: 6 }, (_, index) => {
        const angle = (Math.PI * 2 * index) / 6;
        return circle({
          cx: cx + Math.cos(angle) * reelRadius * 0.42,
          cy: cy + Math.sin(angle) * reelRadius * 0.42,
          r: reelRadius * 0.12,
          fill: ctx.palette.secondary,
          opacity: 0.8,
        });
      }),
    ]);

  return group([
    rect({ x, y, width, height, rx: 34, fill: ctx.palette.primary }),
    rect({ x: x + width * 0.08, y: y + height * 0.09, width: width * 0.84, height: height * 0.23, rx: 14, fill: ctx.palette.text, opacity: 0.9 }),
    rect({ x: x + width * 0.14, y: y + height * 0.15, width: width * 0.52, height: height * 0.08, fill: ctx.palette.secondary, opacity: 0.6 }),
    rect({ x: x + width * 0.17, y: y + height * 0.38, width: width * 0.66, height: height * 0.26, rx: 20, fill: ctx.palette.background, opacity: 0.82 }),
    reel(leftCx),
    reel(rightCx),
    line({ x1: leftCx + reelRadius * 0.78, y1: cy, x2: rightCx - reelRadius * 0.78, y2: cy, stroke: ctx.palette.accent, 'stroke-width': 5, opacity: 0.64 }),
    polygon({ points: points([[x + width * 0.24, y + height * 0.82], [x + width * 0.76, y + height * 0.82], [x + width * 0.68, y + height * 0.67], [x + width * 0.32, y + height * 0.67]]), fill: ctx.palette.background, opacity: 0.76 }),
    ...screws.map(([sx, sy]) => circle({ cx: sx, cy: sy, r: 6, fill: ctx.palette.muted, opacity: 0.85 })),
  ]);
}

export function renderWaveform(ctx: CoverRenderContext, x: number, y: number, width: number, height: number): string {
  const bars = 54;
  const gap = width / bars;
  const centerY = y + height / 2;

  return group(
    Array.from({ length: bars }, (_, index) => {
      const phase = Math.sin((index / bars) * Math.PI * 4) * 0.35 + 0.55;
      const jitter = 0.55 + randomFloat(ctx.rng) * 0.45;
      const barHeight = Math.max(8, height * phase * jitter);

      return rect({
        x: x + index * gap,
        y: centerY - barHeight / 2,
        width: Math.max(3, gap * 0.45),
        height: barHeight,
        rx: 8,
        fill: index % 5 === 0 ? ctx.palette.accent : ctx.palette.text,
        opacity: index % 5 === 0 ? 0.92 : 0.56,
      });
    }),
  );
}

export function renderMountainLandscape(ctx: CoverRenderContext): string {
  const sunX = randomInt(ctx.rng, 150, 640);
  const sunY = randomInt(ctx.rng, 150, 280);
  const layers = Array.from({ length: 4 }, (_, layer) => {
    const baseY = 440 + layer * 72;
    const peakCount = 6;
    const ridge: Array<[number, number]> = [[-60, baseY]];

    for (let index = 0; index <= peakCount; index += 1) {
      const x = -20 + (ctx.width + 40) * (index / peakCount);
      const y = baseY - randomInt(ctx.rng, 110 - layer * 10, 250 - layer * 18);
      ridge.push([x, y]);
    }

    ridge.push([ctx.width + 60, baseY], [ctx.width + 60, ctx.height], [-60, ctx.height]);

    return polygon({
      points: points(ridge),
      fill: [ctx.palette.primary, ctx.palette.secondary, ctx.palette.muted, ctx.palette.background][layer],
      opacity: [0.95, 0.82, 0.58, 0.34][layer],
    });
  }).join('');

  return group([
    circle({ cx: sunX, cy: sunY, r: 72, fill: ctx.palette.accent, opacity: 0.88 }),
    rect({ x: 0, y: 0, width: ctx.width, height: ctx.height, fill: ctx.palette.secondary, opacity: 0.08 }),
    layers,
  ]);
}

export function renderMoonClouds(ctx: CoverRenderContext): string {
  const stars = Array.from({ length: 58 }, () =>
    circle({
      cx: randomInt(ctx.rng, 30, ctx.width - 30),
      cy: randomInt(ctx.rng, 30, 430),
      r: randomInt(ctx.rng, 1, 3),
      fill: ctx.palette.text,
      opacity: (0.22 + randomFloat(ctx.rng) * 0.52).toFixed(2),
    }),
  ).join('');

  const cloud = (cx: number, cy: number, scale: number) =>
    group([
      ellipse({ cx, cy, rx: 72 * scale, ry: 25 * scale, fill: ctx.palette.text, opacity: 0.16 }),
      ellipse({ cx: cx - 38 * scale, cy: cy - 8 * scale, rx: 38 * scale, ry: 25 * scale, fill: ctx.palette.text, opacity: 0.18 }),
      ellipse({ cx: cx + 20 * scale, cy: cy - 16 * scale, rx: 48 * scale, ry: 33 * scale, fill: ctx.palette.text, opacity: 0.17 }),
      ellipse({ cx: cx + 68 * scale, cy: cy + 1 * scale, rx: 44 * scale, ry: 22 * scale, fill: ctx.palette.text, opacity: 0.14 }),
    ]);

  return group([
    stars,
    circle({ cx: 585, cy: 160, r: 86, fill: ctx.palette.accent, opacity: 0.82 }),
    circle({ cx: 554, cy: 136, r: 84, fill: ctx.palette.background, opacity: 0.72 }),
    cloud(250, 320, 1.2),
    cloud(570, 390, 0.9),
    cloud(130, 470, 0.78),
  ]);
}

export function renderCitySkyline(ctx: CoverRenderContext, y = 430): string {
  const buildings: string[] = [];
  let x = -10;

  while (x < ctx.width + 20) {
    const width = randomInt(ctx.rng, 38, 86);
    const height = randomInt(ctx.rng, 110, 330);
    const top = y - height;

    buildings.push(rect({ x, y: top, width, height, fill: ctx.palette.primary, opacity: 0.94 }));

    if (randomFloat(ctx.rng) > 0.55) {
      buildings.push(polygon({ points: points([[x, top], [x + width / 2, top - randomInt(ctx.rng, 26, 64)], [x + width, top]]), fill: ctx.palette.primary, opacity: 0.94 }));
    }

    const windowCols = Math.max(1, Math.floor(width / 18));
    const windowRows = Math.max(2, Math.floor(height / 34));
    for (let col = 0; col < windowCols; col += 1) {
      for (let row = 0; row < windowRows; row += 1) {
        if (randomFloat(ctx.rng) > 0.56) {
          buildings.push(rect({
            x: x + 10 + col * 18,
            y: top + 20 + row * 30,
            width: 6,
            height: 12,
            fill: ctx.palette.accent,
            opacity: 0.7,
          }));
        }
      }
    }

    x += width + randomInt(ctx.rng, 4, 12);
  }

  return group([
    line({ x1: 0, y1: y, x2: ctx.width, y2: y, stroke: ctx.palette.accent, 'stroke-width': 4, opacity: 0.62 }),
    buildings.join(''),
  ]);
}

export function renderBotanical(ctx: CoverRenderContext, x = 130, y = 620, height = 420): string {
  const stems = Array.from({ length: 9 }, (_, index) => {
    const baseX = x + index * 58 + randomInt(ctx.rng, -16, 16);
    const topX = baseX + randomInt(ctx.rng, -48, 48);
    const topY = y - height + randomInt(ctx.rng, -30, 70);
    const stem = path({
      d: `M ${baseX} ${y} C ${baseX - randomInt(ctx.rng, 40, 80)} ${y - height * 0.35}, ${topX + randomInt(ctx.rng, -40, 40)} ${y - height * 0.72}, ${topX} ${topY}`,
      fill: 'none',
      stroke: ctx.palette.primary,
      'stroke-width': randomInt(ctx.rng, 4, 7),
      opacity: 0.84,
      'stroke-linecap': 'round',
    });

    const leaves = Array.from({ length: randomInt(ctx.rng, 3, 6) }, (_, leafIndex) => {
      const t = (leafIndex + 1) / 7;
      const lx = baseX + (topX - baseX) * t + randomInt(ctx.rng, -22, 22);
      const ly = y + (topY - y) * t + randomInt(ctx.rng, -16, 16);
      const rotate = randomInt(ctx.rng, -60, 60);

      return ellipse({
        cx: lx,
        cy: ly,
        rx: randomInt(ctx.rng, 13, 27),
        ry: randomInt(ctx.rng, 30, 54),
        fill: leafIndex % 2 === 0 ? ctx.palette.secondary : ctx.palette.accent,
        opacity: 0.58,
        transform: `rotate(${rotate} ${lx} ${ly})`,
      });
    }).join('');

    return `${stem}${leaves}`;
  }).join('');

  return group(stems);
}

export function renderSpeakerStack(ctx: CoverRenderContext, x: number, y: number, width: number, height: number): string {
  const columns = 2;
  const rows = 2;
  const gap = 18;
  const boxWidth = (width - gap) / columns;
  const boxHeight = (height - gap) / rows;
  const boxes: string[] = [];

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < columns; col += 1) {
      const bx = x + col * (boxWidth + gap);
      const by = y + row * (boxHeight + gap);
      const cone = Math.min(boxWidth, boxHeight) * 0.28;

      boxes.push(group([
        rect({ x: bx, y: by, width: boxWidth, height: boxHeight, rx: 18, fill: ctx.palette.primary, stroke: ctx.palette.accent, 'stroke-width': 3, opacity: 0.92 }),
        circle({ cx: bx + boxWidth * 0.5, cy: by + boxHeight * 0.45, r: cone, fill: ctx.palette.background, stroke: ctx.palette.secondary, 'stroke-width': 8 }),
        circle({ cx: bx + boxWidth * 0.5, cy: by + boxHeight * 0.45, r: cone * 0.44, fill: ctx.palette.accent, opacity: 0.82 }),
        rect({ x: bx + boxWidth * 0.2, y: by + boxHeight * 0.76, width: boxWidth * 0.6, height: 9, rx: 5, fill: ctx.palette.muted, opacity: 0.75 }),
      ]));
    }
  }

  return group(boxes);
}

export function renderTopographicLines(ctx: CoverRenderContext, cx = 400, cy = 350, radius = 280): string {
  const lines = Array.from({ length: 11 }, (_, lineIndex) => {
    const currentRadius = radius - lineIndex * 22;
    const segments = 10;
    const commands: string[] = [];

    for (let index = 0; index <= segments; index += 1) {
      const angle = (Math.PI * 2 * index) / segments;
      const wobble = Math.sin(index * 1.7 + lineIndex) * 18 + randomInt(ctx.rng, -12, 12);
      const x = cx + Math.cos(angle) * (currentRadius + wobble);
      const y = cy + Math.sin(angle) * (currentRadius * 0.62 + wobble);

      if (index === 0) {
        commands.push(`M ${formatNumber(x)} ${formatNumber(y)}`);
      } else {
        const prevAngle = (Math.PI * 2 * (index - 0.5)) / segments;
        const c1x = cx + Math.cos(prevAngle) * (currentRadius + wobble + 20);
        const c1y = cy + Math.sin(prevAngle) * (currentRadius * 0.62 + wobble + 12);
        commands.push(`Q ${formatNumber(c1x)} ${formatNumber(c1y)} ${formatNumber(x)} ${formatNumber(y)}`);
      }
    }

    commands.push('Z');
    return path({
      d: commands.join(' '),
      fill: 'none',
      stroke: lineIndex % 2 === 0 ? ctx.palette.accent : ctx.palette.secondary,
      'stroke-width': lineIndex % 3 === 0 ? 3 : 1.5,
      opacity: 0.12 + lineIndex * 0.035,
    });
  }).join('');

  return group(lines);
}

export function renderAbstractPortrait(ctx: CoverRenderContext, x = 270, y = 150, scale = 1): string {
  const skin = pick(ctx.rng, [ctx.palette.secondary, ctx.palette.muted, ctx.palette.accent]);
  const facePath = `M ${x + 95 * scale} ${y + 44 * scale} C ${x + 176 * scale} ${y + 76 * scale}, ${x + 190 * scale} ${y + 218 * scale}, ${x + 128 * scale} ${y + 292 * scale} C ${x + 84 * scale} ${y + 344 * scale}, ${x + 8 * scale} ${y + 306 * scale}, ${x + 29 * scale} ${y + 230 * scale} C ${x + 41 * scale} ${y + 186 * scale}, ${x - 5 * scale} ${y + 154 * scale}, ${x + 26 * scale} ${y + 95 * scale} C ${x + 43 * scale} ${y + 60 * scale}, ${x + 68 * scale} ${y + 40 * scale}, ${x + 95 * scale} ${y + 44 * scale} Z`;

  return group([
    path({ d: facePath, fill: skin, opacity: 0.82 }),
    path({ d: `M ${x + 84 * scale} ${y + 108 * scale} C ${x + 48 * scale} ${y + 146 * scale}, ${x + 72 * scale} ${y + 227 * scale}, ${x + 48 * scale} ${y + 286 * scale}`, fill: 'none', stroke: ctx.palette.primary, 'stroke-width': 10 * scale, 'stroke-linecap': 'round', opacity: 0.8 }),
    circle({ cx: x + 117 * scale, cy: y + 143 * scale, r: 9 * scale, fill: ctx.palette.primary }),
    path({ d: `M ${x + 109 * scale} ${y + 211 * scale} Q ${x + 143 * scale} ${y + 230 * scale} ${x + 167 * scale} ${y + 198 * scale}`, fill: 'none', stroke: ctx.palette.primary, 'stroke-width': 7 * scale, 'stroke-linecap': 'round' }),
    path({ d: `M ${x + 50 * scale} ${y + 66 * scale} C ${x + 90 * scale} ${y - 6 * scale}, ${x + 177 * scale} ${y + 22 * scale}, ${x + 198 * scale} ${y + 103 * scale}`, fill: 'none', stroke: ctx.palette.accent, 'stroke-width': 24 * scale, 'stroke-linecap': 'round', opacity: 0.7 }),
  ]);
}
