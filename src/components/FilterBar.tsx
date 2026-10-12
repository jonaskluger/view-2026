interface FilterBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  types: { type: string; count: number }[];
  activeType: string | null;
  onTypeChange: (type: string | null) => void;
}

export function FilterBar({ query, onQueryChange, types, activeType, onTypeChange }: FilterBarProps) {
  return (
    <div className="px-4 pt-3">
      <div className="mx-auto max-w-3xl">
        <div className="relative">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search talks, speakers, rooms…"
            className="w-full rounded-xl bg-zinc-900 py-2.5 pl-9 pr-3 text-sm text-zinc-100 ring-1 ring-zinc-800 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        {types.length > 1 && (
          <div className="scrollbar-none -mx-4 mt-2.5 flex gap-1.5 overflow-x-auto px-4 pb-1">
            <button
              onClick={() => onTypeChange(null)}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition active:scale-95 ${
                activeType === null
                  ? 'bg-zinc-100 text-zinc-900'
                  : 'bg-zinc-900 text-zinc-400 ring-1 ring-zinc-800 hover:text-zinc-200'
              }`}
            >
              All
            </button>
            {types.map(({ type, count }) => (
              <button
                key={type}
                onClick={() => onTypeChange(activeType === type ? null : type)}
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition active:scale-95 ${
                  activeType === type
                    ? 'bg-zinc-100 text-zinc-900'
                    : 'bg-zinc-900 text-zinc-400 ring-1 ring-zinc-800 hover:text-zinc-200'
                }`}
              >
                {type} <span className="opacity-60">{count}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
