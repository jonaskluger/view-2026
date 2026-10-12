import { useState } from 'react';
import type { Session } from '../types';
import { formatTimeRange } from '../lib/datetime';
import { typeBadgeClass } from '../lib/typeStyles';
import { StarButton } from './StarButton';

interface SessionCardProps {
  session: Session;
  live: boolean;
  past: boolean;
  favorite: boolean;
  onToggleFavorite: () => void;
}

export function SessionCard({ session, live, past, favorite, onToggleFavorite }: SessionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const collapsed = past && !expanded;

  const Wrapper = session.url ? 'a' : 'div';
  const wrapperProps = session.url
    ? { href: session.url, target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      onClick={
        past
          ? (e) => {
              e.preventDefault();
              e.stopPropagation();
              setExpanded((v) => !v);
            }
          : undefined
      }
      className={`block rounded-2xl bg-zinc-900 p-3.5 ring-1 transition ${
        live
          ? 'ring-2 ring-view'
          : 'ring-zinc-800 hover:ring-view/50'
      } ${session.url && !past ? 'active:scale-[0.99]' : ''} ${
        collapsed ? 'cursor-pointer py-2.5 opacity-45 hover:opacity-70' : past ? 'cursor-pointer opacity-70' : ''
      }`}
    >
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
        <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-semibold ring-1 ${typeBadgeClass(session.type)}`}>
          {session.type}
        </span>
        {live && (
          <span className="flex items-center gap-1.5 rounded-full bg-view px-2 py-0.5 text-[11px] font-extrabold tracking-wide text-white">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
            </span>
            NOW
          </span>
        )}
        <span className="text-xs font-medium tabular-nums text-zinc-400">
          {formatTimeRange(session.start, session.end)}
        </span>
        {!collapsed && (
          <span className="text-xs text-zinc-500">
            {session.room}
            {session.attendance === 'Remote' ? ' · Remote' : ''}
          </span>
        )}
        <StarButton active={favorite} onToggle={onToggleFavorite} />
      </div>

      <h3
        className={`font-semibold leading-snug text-zinc-100 ${
          collapsed ? 'mt-1 truncate text-sm' : 'mt-2 text-[15px]'
        }`}
      >
        {session.title}
        {session.url && !past && <span className="ml-1 text-view">↗</span>}
        {collapsed && <span className="ml-1.5 text-xs text-zinc-500">+</span>}
      </h3>

      {!collapsed && session.speakers.length > 0 && (
        <ul className="mt-2 space-y-1">
          {session.speakers.map((speaker, i) => (
            <li key={`${speaker.name}-${i}`} className="text-sm leading-snug">
              <span className="font-medium text-zinc-300">
                {speaker.name}
                {speaker.remote && <span className="ml-1 text-xs text-zinc-500">(Remote)</span>}
              </span>
              {speaker.role && <span className="text-zinc-500"> — {speaker.role}</span>}
            </li>
          ))}
        </ul>
      )}
    </Wrapper>
  );
}
