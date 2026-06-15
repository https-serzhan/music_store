import { createRng, pick, randomInt } from '../utils/rng.js';
import type { SupportedLocale } from '../utils/validation.js';

export type ScaleMode = 'major' | 'minor';
export type SynthType = 'synth' | 'fm' | 'am';

export type MusicPreview = {
  bpm: number;
  key: string;
  scale: ScaleMode;
  synth: SynthType;
  chords: Array<{ time: string; notes: string[]; duration: string }>;
  melody: Array<{ time: string; note: string; duration: string }>;
  bass: Array<{ time: string; note: string; duration: string }>;
};

const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const keys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const keyOffsets: Record<string, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

const scaleIntervals: Record<ScaleMode, number[]> = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
};

const progressions: Record<ScaleMode, number[][]> = {
  major: [
    [1, 5, 6, 4],
    [1, 4, 5, 1],
    [6, 4, 1, 5],
    [1, 6, 4, 5],
  ],
  minor: [
    [1, 6, 3, 7],
    [1, 4, 5, 1],
    [6, 7, 1, 1],
    [1, 7, 6, 7],
  ],
};

function noteFromScale(key: string, scale: ScaleMode, scaleStep: number, octave: number): string {
  const intervals = scaleIntervals[scale];
  const wrappedStep = ((scaleStep % 7) + 7) % 7;
  const diatonicOctaveOffset = Math.floor(scaleStep / 7);
  const rawSemitone = keyOffsets[key] + intervals[wrappedStep];
  const chromaticOctaveOffset = Math.floor(rawSemitone / 12);
  const noteName = noteNames[((rawSemitone % 12) + 12) % 12];

  return `${noteName}${octave + diatonicOctaveOffset + chromaticOctaveOffset}`;
}

function chordForDegree(key: string, scale: ScaleMode, degree: number): string[] {
  const rootStep = degree - 1;

  return [
    noteFromScale(key, scale, rootStep, 4),
    noteFromScale(key, scale, rootStep + 2, 4),
    noteFromScale(key, scale, rootStep + 4, 4),
  ];
}

export function generateMusic(locale: SupportedLocale, seed: string, index: number): MusicPreview {
  const rng = createRng(`music:${locale}:${seed}:${index}`);
  const bpm = randomInt(rng, 120, 152);
  const key = pick(rng, keys);
  const scale = pick<ScaleMode>(rng, ['major', 'minor']);
  const synth = pick<SynthType>(rng, ['synth', 'fm', 'am']);
  const progression = pick(rng, progressions[scale]);
  const repeatedProgression = [...progression, ...progression];
  const rhythmDurations = ['8n', '8n', '4n', '8n', '4n'];

  const chords = repeatedProgression.map((degree, bar) => ({
    time: `${bar}:0:0`,
    notes: chordForDegree(key, scale, degree),
    duration: '1m',
  }));

  const bass = repeatedProgression.flatMap((degree, bar) => {
    const rootStep = degree - 1;
    return [
      {
        time: `${bar}:0:0`,
        note: noteFromScale(key, scale, rootStep, 2),
        duration: '2n',
      },
      {
        time: `${bar}:2:0`,
        note: noteFromScale(key, scale, rootStep + 4, 2),
        duration: '2n',
      },
    ];
  });

  const melody = repeatedProgression.flatMap((degree, bar) => {
    const rootStep = degree - 1;
    const motif = [
      rootStep,
      rootStep + pick(rng, [1, 2, 4]),
      rootStep + pick(rng, [2, 4, 5]),
      rootStep + pick(rng, [-1, 1, 7]),
    ];

    return motif.map((step, beat) => ({
      time: `${bar}:${beat}:0`,
      note: noteFromScale(key, scale, step, 5),
      duration: pick(rng, rhythmDurations),
    }));
  });

  return {
    bpm,
    key,
    scale,
    synth,
    chords,
    melody,
    bass,
  };
}
