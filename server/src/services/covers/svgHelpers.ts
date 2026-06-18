import {
  pick as rngPick,
  randomFloat as rngRandomFloat,
  randomInt as rngRandomInt,
  type Rng,
} from '../../utils/rng.js';

type AttributeValue = string | number | boolean | undefined | null;
type Attributes = Record<string, AttributeValue>;

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function attributeString(attributes: Attributes): string {
  return Object.entries(attributes)
    .filter(([, value]) => value !== undefined && value !== null && value !== false)
    .map(([key, value]) => `${key}="${escapeXml(String(value))}"`)
    .join(' ');
}

export function svg(width: number, height: number, defs: string | string[], body: string | string[], label: string): string {
  const defsContent = Array.isArray(defs) ? defs.filter(Boolean).join('') : defs;
  const bodyContent = Array.isArray(body) ? body.filter(Boolean).join('') : body;
  const defsBlock = defsContent.length > 0 ? `<defs>${defsContent}</defs>` : '';

  return `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeXml(label)}"><title>${escapeXml(label)}</title>${defsBlock}${bodyContent}</svg>`;
}

export function rect(attributes: Attributes): string {
  return `<rect ${attributeString(attributes)} />`;
}

export function circle(attributes: Attributes): string {
  return `<circle ${attributeString(attributes)} />`;
}

export function ellipse(attributes: Attributes): string {
  return `<ellipse ${attributeString(attributes)} />`;
}

export function line(attributes: Attributes): string {
  return `<line ${attributeString(attributes)} />`;
}

export function polygon(attributes: Attributes): string {
  return `<polygon ${attributeString(attributes)} />`;
}

export function path(attributes: Attributes): string {
  return `<path ${attributeString(attributes)} />`;
}

export function text(value: string, attributes: Attributes): string {
  return `<text ${attributeString(attributes)}>${escapeXml(value)}</text>`;
}

export function group(body: string | string[], attributes: Attributes = {}): string {
  const content = Array.isArray(body) ? body.filter(Boolean).join('') : body;
  return `<g ${attributeString(attributes)}>${content}</g>`;
}

export function randomId(prefix: string, rng: Rng): string {
  return `${prefix}-${rngRandomInt(rng, 100000, 999999)}`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
}

export function pick<T>(rng: Rng, values: readonly T[]): T {
  return rngPick(rng, values);
}

export function randomFloat(rng: Rng): number {
  return rngRandomFloat(rng);
}

export function randomInt(rng: Rng, min: number, max: number): number {
  return rngRandomInt(rng, min, max);
}

export function formatNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export function points(values: Array<[number, number]>): string {
  return values.map(([x, y]) => `${formatNumber(x)},${formatNumber(y)}`).join(' ');
}
