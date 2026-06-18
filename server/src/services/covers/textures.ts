import type { CoverRenderContext } from './coverTypes.js';
import { circle, line, randomFloat, randomId, randomInt, rect } from './svgHelpers.js';

export type TextureLayer = {
  defs: string;
  overlay: string;
};

export function grainFilter(id: string, ctx: CoverRenderContext, opacity = 0.14): TextureLayer {
  const seed = randomInt(ctx.rng, 1, 999);
  const frequency = (0.55 + randomFloat(ctx.rng) * 0.25).toFixed(2);

  return {
    defs: `<filter id="${id}" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="${frequency}" numOctaves="3" seed="${seed}" result="noise" /><feColorMatrix in="noise" type="saturate" values="0" /><feComponentTransfer><feFuncA type="table" tableValues="0 ${opacity}" /></feComponentTransfer></filter>`,
    overlay: rect({ x: 0, y: 0, width: ctx.width, height: ctx.height, filter: `url(#${id})`, opacity: 1 }),
  };
}

export function glowFilter(id: string, deviation = 7): string {
  return `<filter id="${id}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="${deviation}" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>`;
}

export function softBlurFilter(id: string, deviation = 16): string {
  return `<filter id="${id}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="${deviation}" /></filter>`;
}

export function halftonePattern(id: string, ctx: CoverRenderContext, size = 18, opacity = 0.18): TextureLayer {
  const radius = randomInt(ctx.rng, 2, 4);

  return {
    defs: `<pattern id="${id}" width="${size}" height="${size}" patternUnits="userSpaceOnUse">${circle({ cx: size / 2, cy: size / 2, r: radius, fill: ctx.palette.text, opacity })}</pattern>`,
    overlay: rect({ x: 0, y: 0, width: ctx.width, height: ctx.height, fill: `url(#${id})`, opacity: 1 }),
  };
}

export function scanlinePattern(id: string, ctx: CoverRenderContext, spacing = 9): TextureLayer {
  return {
    defs: `<pattern id="${id}" width="8" height="${spacing}" patternUnits="userSpaceOnUse">${rect({ x: 0, y: 0, width: 8, height: 1.4, fill: ctx.palette.text, opacity: 0.14 })}</pattern>`,
    overlay: rect({ x: 0, y: 0, width: ctx.width, height: ctx.height, fill: `url(#${id})`, opacity: 1 }),
  };
}

export function paperTexture(ctx: CoverRenderContext): string {
  const blocks = Array.from({ length: 16 }, () => {
    const width = randomInt(ctx.rng, 80, 260);
    const height = randomInt(ctx.rng, 18, 90);
    const x = randomInt(ctx.rng, -30, ctx.width - 40);
    const y = randomInt(ctx.rng, -20, ctx.height - 20);
    const rotate = randomInt(ctx.rng, -4, 4);

    return rect({
      x,
      y,
      width,
      height,
      fill: ctx.palette.secondary,
      opacity: (0.03 + randomFloat(ctx.rng) * 0.08).toFixed(2),
      transform: `rotate(${rotate} ${x + width / 2} ${y + height / 2})`,
    });
  }).join('');

  const dots = Array.from({ length: 90 }, () =>
    circle({
      cx: randomInt(ctx.rng, 0, ctx.width),
      cy: randomInt(ctx.rng, 0, ctx.height),
      r: randomInt(ctx.rng, 1, 2),
      fill: ctx.palette.primary,
      opacity: (0.05 + randomFloat(ctx.rng) * 0.09).toFixed(2),
    }),
  ).join('');

  const fibers = Array.from({ length: 24 }, () => {
    const x = randomInt(ctx.rng, 0, ctx.width);
    const y = randomInt(ctx.rng, 0, ctx.height);
    return line({
      x1: x,
      y1: y,
      x2: x + randomInt(ctx.rng, 24, 90),
      y2: y + randomInt(ctx.rng, -10, 10),
      stroke: ctx.palette.muted,
      'stroke-width': 1,
      opacity: 0.08,
    });
  }).join('');

  return `${blocks}${dots}${fibers}`;
}

export function scratchOverlay(ctx: CoverRenderContext, count = 28): string {
  return Array.from({ length: count }, () => {
    const x = randomInt(ctx.rng, -80, ctx.width + 40);
    const y = randomInt(ctx.rng, -40, ctx.height + 40);
    const length = randomInt(ctx.rng, 50, 260);
    const angle = randomInt(ctx.rng, -16, 16);

    return line({
      x1: x,
      y1: y,
      x2: x + length,
      y2: y + randomInt(ctx.rng, -12, 12),
      stroke: ctx.palette.text,
      'stroke-width': randomInt(ctx.rng, 1, 2),
      opacity: (0.05 + randomFloat(ctx.rng) * 0.13).toFixed(2),
      transform: `rotate(${angle} ${x} ${y})`,
    });
  }).join('');
}

export function textureIds(ctx: CoverRenderContext, prefix: string): { grain: string; glow: string; halftone: string; scanline: string; blur: string } {
  return {
    grain: randomId(`${prefix}-grain`, ctx.rng),
    glow: randomId(`${prefix}-glow`, ctx.rng),
    halftone: randomId(`${prefix}-dots`, ctx.rng),
    scanline: randomId(`${prefix}-scan`, ctx.rng),
    blur: randomId(`${prefix}-blur`, ctx.rng),
  };
}
