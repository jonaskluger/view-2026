import { useEffect, useMemo, useState } from 'react';
import { Header } from './components/Header';
import { DayTabs } from './components/DayTabs';
import { FilterBar } from './components/FilterBar';
import { SessionCard } from './components/SessionCard';
import { useProgram } from './lib/useProgram';
import { getRomeNow, isOngoing } from './lib/datetime';
import type { Session } from './types';

function groupByStart(sessions: Session[]): [string, Session[]][] {
  const groups = new Map<string, Session[]>();
  for (const session of sessions) {
    const list = groups.get(session.start);
    if (list) list.push(session);
    else groups.set(session.start, [session]);
  }
  return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));
}

export default function App() {
  const { program, source, loading, error, refresh } = useProgram();
  const [now, setNow] = useState(getRomeNow);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [activeType, setActiveType] = useState<string | null>(null);

  // Keep "now" fresh for the live indicator.
  useEffect(() => {
    const timer = setInterval(() => setNow(getRomeNow()), 30_000);
    return () => clearInterval(timer);
  }, []);

  // Default the selected day to today when we're inside the conference week.
  useEffect(() => {
    if (!program || selectedDay) return;
    const today = program.days.find((d) => d.date === now.date);
    setSelectedDay((today ?? program.days[0])?.id ?? null);
  }, [program, selectedDay, now.date]);

  const daySessions = useMemo(
    () => program?.sessions.filter((s) => s.day === selectedDay) ?? [],
    [program, selectedDay],
  );

  const types = useMemo(() => {
    const counts = new Map<string, number>();
    for (const s of daySessions) counts.set(s.type, (counts.get(s.type) ?? 0) + 1);
    return [...counts.entries()]
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count || a.type.localeCompare(b.type));
  }, [daySessions]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return daySessions.filter((s) => {
      if (activeType && s.type !== activeType) return false;
      if (!q) return true;
      const haystack = [
        s.title,
        s.room,
        s.type,
        ...s.speakers.flatMap((sp) => [sp.name, sp.role ?? '']),
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [daySessions, query, activeType]);

  const groups = useMemo(() => groupByStart(visible), [visible]);

  return (
    <div className="min-h-dvh pb-10">
      <Header
        lastUpdated={program?.lastUpdated ?? null}
        source={source}
        loading={loading}
        onRefresh={refresh}
      />

      {program && program.days.length > 0 && selectedDay && (
        <DayTabs days={program.days} selected={selectedDay} today={now.date} onSelect={setSelectedDay} />
      )}

      {program && (
        <FilterBar
          query={query}
          onQueryChange={setQuery}
          types={types}
          activeType={activeType}
          onTypeChange={setActiveType}
        />
      )}

      <main className="mx-auto max-w-3xl px-4">
        {error && !program && (
          <div className="mt-6 rounded-2xl bg-red-500/10 p-4 text-sm text-red-300 ring-1 ring-red-400/30">
            {error}
            <button onClick={refresh} className="ml-2 font-semibold underline underline-offset-2">
              Retry
            </button>
          </div>
        )}

        {loading && !program && (
          <div className="mt-6 space-y-3" aria-label="Loading program">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-zinc-900 ring-1 ring-zinc-800" />
            ))}
          </div>
        )}

        {program && groups.length === 0 && (
          <p className="mt-10 text-center text-sm text-zinc-500">
            No sessions match your filters for this day.
          </p>
        )}

        {groups.map(([start, sessions]) => (
          <section key={start} className="mt-6">
            <h2 className="sticky top-[68px] z-10 -mx-4 bg-zinc-950/95 px-4 py-1.5 text-sm font-bold tabular-nums text-zinc-300 backdrop-blur">
              {start}
            </h2>
            <div className="mt-2 space-y-2.5">
              {sessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  live={isOngoing(session.start, session.end, now.hm, session.date, now.date)}
                />
              ))}
            </div>
          </section>
        ))}
      </main>

      <footer className="mx-auto mt-10 max-w-3xl px-4 text-xs leading-relaxed text-zinc-600">
        <p>
          Data from the official{' '}
          <a
            href="https://www.viewconference.it/assets/html/view_CET.html"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-zinc-400"
          >
            VIEW Conference program
          </a>
          , refreshed automatically — schedule changes on the source page appear here within about 15 minutes.
          All times are Italy local time (CET).
        </p>
        <p className="mt-2">
          Oct 12: ITS ICT, Via Jacopo Durandi 13 · Oct 13–16: OGR, Corso Castelfidardo 22 · Evening screenings:
          Cinema Massimo, Via Giuseppe Verdi 18
        </p>
      </footer>
    </div>
  );
}
