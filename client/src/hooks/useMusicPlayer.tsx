import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { getContext, start } from 'tone/build/esm/core/Global.js';
import { Time } from 'tone/build/esm/core/type/Time.js';
import { AMSynth } from 'tone/build/esm/instrument/AMSynth.js';
import { FMSynth } from 'tone/build/esm/instrument/FMSynth.js';
import { MonoSynth } from 'tone/build/esm/instrument/MonoSynth.js';
import { PolySynth } from 'tone/build/esm/instrument/PolySynth.js';
import { Synth } from 'tone/build/esm/instrument/Synth.js';
import type { MusicPreview, SynthType } from '../types/song';

type DisposableNode = {
  dispose: () => void;
};

type MusicPlayerValue = {
  playingId: string | null;
  play: (id: string, music: MusicPreview) => Promise<void>;
  stop: () => void;
};

const MusicPlayerContext = createContext<MusicPlayerValue | null>(null);

function getTransport() {
  return getContext().transport;
}

function createLeadSynth(type: SynthType) {
  if (type === 'fm') {
    const synth = new FMSynth().toDestination();
    synth.volume.value = -9;
    return synth;
  }

  if (type === 'am') {
    const synth = new AMSynth().toDestination();
    synth.volume.value = -9;
    return synth;
  }

  const synth = new Synth({
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.02, decay: 0.14, sustain: 0.35, release: 0.35 },
  }).toDestination();
  synth.volume.value = -8;
  return synth;
}

export function MusicPlayerProvider({ children }: PropsWithChildren) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const nodesRef = useRef<DisposableNode[]>([]);
  const timerRef = useRef<number | null>(null);

  const disposeNodes = useCallback(() => {
    for (const node of nodesRef.current) {
      node.dispose();
    }

    nodesRef.current = [];
  }, []);

  const stop = useCallback(() => {
    const transport = getTransport();
    transport.stop();
    transport.cancel();

    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    disposeNodes();
    setPlayingId(null);
  }, [disposeNodes]);

  const play = useCallback(
    async (id: string, music: MusicPreview) => {
      if (playingId === id) {
        stop();
        return;
      }

      stop();
      await start();

      const transport = getTransport();
      transport.bpm.value = music.bpm;

      const chordSynth = new PolySynth(Synth, {
        volume: -15,
        oscillator: { type: 'sine' },
        envelope: { attack: 0.04, decay: 0.2, sustain: 0.45, release: 0.7 },
      }).toDestination();
      const leadSynth = createLeadSynth(music.synth);
      const bassSynth = new MonoSynth({
        oscillator: { type: 'square' },
        filter: { Q: 1, type: 'lowpass', rolloff: -24 },
        envelope: { attack: 0.03, decay: 0.2, sustain: 0.55, release: 0.4 },
        filterEnvelope: { attack: 0.02, decay: 0.2, sustain: 0.3, release: 0.5, baseFrequency: 80, octaves: 2.5 },
      }).toDestination();

      bassSynth.volume.value = -14;
      nodesRef.current = [chordSynth, leadSynth, bassSynth];

      for (const chord of music.chords) {
        transport.schedule((time) => {
          chordSynth.triggerAttackRelease(chord.notes, chord.duration, time);
        }, chord.time);
      }

      for (const note of music.melody) {
        transport.schedule((time) => {
          leadSynth.triggerAttackRelease(note.note, note.duration, time);
        }, note.time);
      }

      for (const note of music.bass) {
        transport.schedule((time) => {
          bassSynth.triggerAttackRelease(note.note, note.duration, time);
        }, note.time);
      }

      const seconds = Time('8m').toSeconds();
      timerRef.current = window.setTimeout(stop, seconds * 1000 + 250);
      transport.start('+0.05');
      setPlayingId(id);
    },
    [playingId, stop],
  );

  useEffect(() => stop, [stop]);

  return (
    <MusicPlayerContext.Provider value={{ playingId, play, stop }}>
      {children}
    </MusicPlayerContext.Provider>
  );
}

export function useMusicPlayer(): MusicPlayerValue {
  const value = useContext(MusicPlayerContext);

  if (!value) {
    throw new Error('useMusicPlayer must be used inside MusicPlayerProvider.');
  }

  return value;
}
