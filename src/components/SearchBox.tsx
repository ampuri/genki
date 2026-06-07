interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function SearchBox({ value, onChange }: Props) {
  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-faint)] pointer-events-none"
        width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search grammar… (e.g. て-form, potential)"
        className="w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--ink)] placeholder:text-[var(--ink-faint)] pl-10 pr-4 py-3 text-base focus:outline-none focus:ring-2 focus:border-transparent"
        style={{ '--tw-ring-color': 'var(--brand)' } as React.CSSProperties}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        enterKeyHint="search"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-faint)] hover:text-[var(--ink)] w-6 h-6 flex items-center justify-center rounded-full touch-manipulation"
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
}
