import type { Session } from '../types';
import { formatTimeRange } from '../lib/datetime';
import { typeBadgeClass } from '../lib/typeStyles';

interface SessionCardProps {
  session: Session;
  live: boolean;
}

export function SessionCard({ session, live }: SessionCardProps) {
  const Wrapper = session.url ? 'a' : 'div';
  const wrapperProps = session.url
    ? { href: session.url, target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={`block rounded-2xl bg-zinc-900 p-3.5 ring-1 transition ${
        live
          ? 'ring-2 ring-orange-500/70'
          : 'ring-zinc-800 hover:ring-zinc-700'
      } ${session.url ? 'active:scale-[0.99]' : ''}`}
    >
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
        <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-semibold ring-1 ${typeBadgeClass(session.type)}`}>
          {session.type}
        </span>
        {live && (
          <span className="flex items-center gap-1.5 rounded-md bg-orange-500/15 px-1.5 py-0.5 text-[11px] font-semibold text-orange-300 ring-1 ring-orange-400/30">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-orange-400" />
            </span>
            NOW
          </span>
        )}
        <span className="text-xs font-medium tabular-nums text-zinc-400">
          {formatTimeRange(session.start, session.end)}
        </span>
        <span className="text-xs text-zinc-500">
          {session.room}
          {session.attendance === 'Remote' ? ' · Remote' : ''}
        </span>
      </div>

      <h3 className="mt-2 text-[15px] font-semibold leading-snug text-zinc-100">
        {session.title}
        {session.url && <span className="ml-1 text-zinc-500">↗</span>}
      </h3>

      {session.speakers.length > 0 && (
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
