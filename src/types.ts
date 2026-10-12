export interface Speaker {
  name: string;
  url: string | null;
  role: string | null;
  remote: boolean;
}

export interface Session {
  /** Stable id from the source markup, e.g. "session-46". */
  id: string;
  /** Day key, e.g. "12". */
  day: string;
  /** ISO date, e.g. "2026-10-12". */
  date: string;
  /** "HH:MM" (Europe/Rome wall time as published). */
  start: string;
  /** "HH:MM". */
  end: string;
  title: string;
  /** Link to the session article, when published. */
  url: string | null;
  /** Normalized type: Talk | Panel | Workshop | Masterclass | Keynote | Lab | Screening | Signing | Portfolio Reviews | Ask Me Anything | ... */
  type: string;
  /** Raw type label as published, e.g. "4-hour Workshop in English". */
  typeLabel: string;
  language: string | null;
  room: string;
  /** e.g. "In Person". */
  attendance: string | null;
  speakers: Speaker[];
}

export interface ProgramDay {
  /** Day key, e.g. "12". */
  id: string;
  /** Display label, e.g. "Mon 12th". */
  label: string;
  /** Short weekday, e.g. "Mon". */
  weekday: string;
  /** ISO date, e.g. "2026-10-12". */
  date: string;
}

export interface Program {
  /** Human-readable stamp from the source, e.g. "Saturday, October 10th, 2026 at 12:32 CET". */
  lastUpdated: string | null;
  /** ISO timestamp of when this payload was fetched/parsed. */
  fetchedAt: string;
  days: ProgramDay[];
  sessions: Session[];
}
