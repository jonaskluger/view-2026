import type { ProgramSource } from '../lib/useProgram';

interface HeaderProps {
  lastUpdated: string | null;
  source: ProgramSource | null;
  loading: boolean;
  onRefresh: () => void;
}

const SOURCE_LABEL: Record<ProgramSource, { text: string; className: string }> = {
  live: { text: 'Live', className: 'bg-emerald-500/15 text-emerald-300 ring-emerald-400/30' },
  snapshot: { text: 'Snapshot', className: 'bg-amber-500/15 text-amber-300 ring-amber-400/30' },
  cache: { text: 'Offline cache', className: 'bg-zinc-500/15 text-zinc-300 ring-zinc-400/30' },
};

export function Header({ lastUpdated, source, loading, onRefresh }: HeaderProps) {
  const badge = source ? SOURCE_LABEL[source] : null;
  return (
    <header className="border-b-2 border-view bg-zinc-950/90 px-4 pb-3 pt-3 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img src="/view-logo.png" alt="VIEW Conference logo" className="h-8 w-auto" />
          <h1 className="text-xl font-semibold leading-tight tracking-tight text-view sm:text-2xl">
            VIEW Conference 2026
          </h1>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-view px-4 py-2 text-sm font-bold text-white shadow-lg shadow-view/25 transition hover:bg-view-deep active:scale-95 disabled:opacity-50"
          aria-label="Refresh program"
        >
          <svg
            className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12a9 9 0 1 1-2.64-6.36" />
            <path d="M21 3v6h-6" />
          </svg>
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>
      <div className="mx-auto mt-3 flex max-w-3xl items-center gap-2 text-xs text-zinc-500">
        {badge && (
          <span className={`shrink-0 rounded-full px-2 py-0.5 font-medium ring-1 ${badge.className}`}>{badge.text}</span>
        )}
        {lastUpdated && <span className="min-w-0 truncate">Schedule updated: {lastUpdated}</span>}
      </div>
    </header>
  );
}
