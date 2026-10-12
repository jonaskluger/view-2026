import { useEffect, useRef } from 'react';
import type { ProgramDay } from '../types';

interface DayTabsProps {
  days: ProgramDay[];
  selected: string;
  today: string;
  onSelect: (dayId: string) => void;
  favoritesCount: number;
  favoritesActive: boolean;
  onShowFavorites: () => void;
}

export function DayTabs({ days, selected, today, onSelect, favoritesCount, favoritesActive, onShowFavorites }: DayTabsProps) {
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: 'instant', inline: 'center', block: 'nearest' });
  }, [selected]);

  return (
    <nav
      className="sticky top-0 z-20 flex gap-1.5 border-b border-zinc-800 bg-zinc-950/95 px-3 py-2 backdrop-blur"
      aria-label="Conference days"
    >
      <button
        onClick={onShowFavorites}
        className={`flex shrink-0 min-w-[4.5rem] flex-col items-center justify-center rounded-full px-3 py-1.5 text-sm transition active:scale-95 ${
          favoritesActive
            ? 'bg-view-yellow font-bold text-zinc-950'
            : 'bg-zinc-900 text-zinc-300 ring-1 ring-zinc-800 hover:ring-view/50'
        }`}
        aria-pressed={favoritesActive}
      >
        <span className="text-[11px] font-medium uppercase tracking-wide opacity-80">Saved</span>
        <span className="text-base font-bold leading-tight">
          ★ {favoritesCount > 0 ? favoritesCount : ''}
        </span>
      </button>
      <div className="w-px shrink-0 self-stretch bg-zinc-800" aria-hidden="true" />
      <div className="scrollbar-none flex flex-1 gap-1.5 overflow-x-auto">
        {days.map((day) => {
        const isActive = day.id === selected;
        const isToday = day.date === today;
        return (
          <button
            key={day.id}
            ref={isActive ? activeRef : undefined}
            onClick={() => onSelect(day.id)}
            className={`relative flex min-w-[4.5rem] flex-col items-center rounded-full px-3 py-1.5 text-sm transition active:scale-95 ${
              isActive
                ? 'bg-view font-bold text-white shadow-md shadow-view/25'
                : 'bg-zinc-900 text-zinc-300 ring-1 ring-zinc-800 hover:ring-view/50'
            }`}
          >
            <span className="text-[11px] font-bold uppercase tracking-wide opacity-75">{day.weekday}</span>
            <span className="text-base font-extrabold leading-tight">Oct {day.id}</span>
            {isToday && (
              <span
                className={`absolute -top-0.5 right-1.5 h-1.5 w-1.5 rounded-full ${
                  isActive ? 'bg-white' : 'bg-view'
                }`}
                aria-label="Today"
              />
            )}
          </button>
        );
        })}
      </div>
    </nav>
  );
}
