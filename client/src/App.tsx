import { useEffect, useState } from 'react';
import { fetchRandomSeed } from './api/songsApi';
import { GalleryView } from './components/GalleryView';
import { TableView } from './components/TableView';
import { Toolbar } from './components/Toolbar';
import { useSongs } from './hooks/useSongs';
import type { DisplayMode, SupportedLocale } from './types/song';

const defaultSeed = '123456789';
const tablePageSize = 20;
const galleryPageSize = 24;

function clampLikes(value: number): number {
  if (Number.isNaN(value)) {
    return 0;
  }

  return Math.max(0, Math.min(10, Math.round(value * 10) / 10));
}

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedValue(value), delayMs);
    return () => window.clearTimeout(timeout);
  }, [delayMs, value]);

  return debouncedValue;
}

export function App() {
  const [locale, setLocale] = useState<SupportedLocale>('en-US');
  const [seedInput, setSeedInput] = useState(defaultSeed);
  const [likesInput, setLikesInput] = useState(3);
  const [mode, setMode] = useState<DisplayMode>('table');
  const [page, setPage] = useState(1);
  const [isRandomSeedLoading, setIsRandomSeedLoading] = useState(false);
  const debouncedSeed = useDebouncedValue(seedInput, 350);
  const debouncedLikes = useDebouncedValue(likesInput, 220);
  const seed = debouncedSeed.trim().length > 0 ? debouncedSeed.trim() : defaultSeed;
  const likes = clampLikes(debouncedLikes);
  const playbackKey = `${locale}:${seed}`;
  const resetKey = `${locale}:${seed}:${likes}`;
  const tableQuery = useSongs({
    locale,
    seed,
    page,
    pageSize: tablePageSize,
    likes,
  });

  function resetPage() {
    setPage(1);
  }

  async function handleRandomSeed() {
    setIsRandomSeedLoading(true);
    resetPage();

    try {
      const nextSeed = await fetchRandomSeed();
      setSeedInput(nextSeed);
    } finally {
      setIsRandomSeedLoading(false);
    }
  }

  return (
    <div className="appShell">
      <Toolbar
        locale={locale}
        seedInput={seedInput}
        likesInput={likesInput}
        mode={mode}
        isRandomSeedLoading={isRandomSeedLoading}
        onLocaleChange={(nextLocale) => {
          setLocale(nextLocale);
          resetPage();
        }}
        onSeedChange={(nextSeed) => {
          setSeedInput(nextSeed);
          resetPage();
        }}
        onRandomSeed={handleRandomSeed}
        onLikesChange={(nextLikes) => {
          setLikesInput(clampLikes(nextLikes));
          resetPage();
        }}
        onModeChange={setMode}
      />

      <main className="mainContent">
        {mode === 'table' ? (
          <TableView
            data={tableQuery.data}
            isLoading={tableQuery.isLoading}
            isFetching={tableQuery.isFetching}
            error={tableQuery.error}
            page={page}
            playbackKey={playbackKey}
            onPageChange={setPage}
          />
        ) : (
          <GalleryView
            locale={locale}
            seed={seed}
            likes={likes}
            pageSize={galleryPageSize}
            playbackKey={playbackKey}
            resetKey={resetKey}
          />
        )}
      </main>
    </div>
  );
}
