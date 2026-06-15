import type { DisplayMode, SupportedLocale } from '../types/song';

type ToolbarProps = {
  locale: SupportedLocale;
  seedInput: string;
  likesInput: number;
  mode: DisplayMode;
  isRandomSeedLoading: boolean;
  onLocaleChange: (locale: SupportedLocale) => void;
  onSeedChange: (seed: string) => void;
  onRandomSeed: () => void;
  onLikesChange: (likes: number) => void;
  onModeChange: (mode: DisplayMode) => void;
};

const localeOptions: Array<{ value: SupportedLocale; label: string }> = [
  { value: 'en-US', label: 'English (USA)' },
  { value: 'de-DE', label: 'German (Germany)' },
  { value: 'uk-UA', label: 'Ukrainian (Ukraine)' },
];

export function Toolbar({
  locale,
  seedInput,
  likesInput,
  mode,
  isRandomSeedLoading,
  onLocaleChange,
  onSeedChange,
  onRandomSeed,
  onLikesChange,
  onModeChange,
}: ToolbarProps) {
  return (
    <header className="toolbar">
      <div className="toolbarGroup">
        <label className="fieldLabel" htmlFor="locale">
          Language
        </label>
        <select
          id="locale"
          className="selectControl"
          value={locale}
          onChange={(event) => onLocaleChange(event.target.value as SupportedLocale)}
        >
          {localeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="toolbarGroup seedGroup">
        <label className="fieldLabel" htmlFor="seed">
          Seed
        </label>
        <input
          id="seed"
          className="textControl seedInput"
          inputMode="numeric"
          pattern="[0-9]*"
          value={seedInput}
          onChange={(event) => {
            const nextValue = event.target.value.replace(/\D/g, '');
            onSeedChange(nextValue);
          }}
        />
        <button className="button secondaryButton" type="button" onClick={onRandomSeed} disabled={isRandomSeedLoading}>
          {isRandomSeedLoading ? 'Generating' : 'Random seed'}
        </button>
      </div>

      <div className="toolbarGroup likesGroup">
        <label className="fieldLabel" htmlFor="likes">
          Likes
        </label>
        <input
          id="likes"
          className="rangeControl"
          type="range"
          min="0"
          max="10"
          step="0.1"
          value={likesInput}
          onChange={(event) => onLikesChange(Number(event.target.value))}
        />
        <input
          className="numberControl"
          type="number"
          min="0"
          max="10"
          step="0.1"
          value={likesInput}
          onChange={(event) => onLikesChange(Number(event.target.value))}
        />
      </div>

      <div className="modeToggle" aria-label="Display mode">
        <button
          className={mode === 'table' ? 'modeButton activeModeButton' : 'modeButton'}
          type="button"
          onClick={() => onModeChange('table')}
        >
          Table
        </button>
        <button
          className={mode === 'gallery' ? 'modeButton activeModeButton' : 'modeButton'}
          type="button"
          onClick={() => onModeChange('gallery')}
        >
          Gallery
        </button>
      </div>
    </header>
  );
}
