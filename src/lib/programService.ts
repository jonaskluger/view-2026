import { parse, type HTMLElement } from 'node-html-parser';
import type { Program, ProgramDay, Session, Speaker } from '../types';

export const PROGRAM_URL = 'https://www.viewconference.it/assets/html/view_CET.html';

const FETCH_TIMEOUT_MS = 10_000;

/** Fetches the official program page and parses it into structured data. */
export async function getProgram(): Promise<Program> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(PROGRAM_URL, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'view-2026-program-app/1.0 (+https://www.viewconference.it)',
        Accept: 'text/html',
      },
    });
    if (!res.ok) {
      throw new Error(`Upstream responded ${res.status}`);
    }
    const html = await res.text();
    return parseProgram(html);
  } finally {
    clearTimeout(timer);
  }
}

const MONTHS: Record<string, string> = {
  JAN: '01', FEB: '02', MAR: '03', APR: '04', MAY: '05', JUN: '06',
  JUL: '07', AUG: '08', SEP: '09', OCT: '10', NOV: '11', DEC: '12',
};

function clean(text: string | null | undefined): string {
  return (text ?? '').replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
}

/** "4-hour Workshop" → "Workshop", "16-Hour over 4-Day Lab" → "Lab". */
function normalizeType(label: string): string {
  return label.replace(/^\d+-?hour\b(\s+over\s+\d+-?day\b)?\s*/i, '').trim();
}

function parseSpeakers(sessionEl: HTMLElement): Speaker[] {
  return sessionEl.querySelectorAll('.session-presenter').map((el) => {
    const link = el.querySelector('a');
    const roleEl = el.querySelector('.session-presenter-title');
    const fullText = clean(el.text);
    const name = clean(link?.text ?? el.firstChild?.text);
    let role = clean(roleEl?.text);
    if (!role) {
      // Some entries carry the role as loose text after the link instead of
      // a .session-presenter-title span, e.g. "<a>NAME</a>, VFX Supervisor".
      role = fullText.replace(name, '').replace(/\(Remote\)/i, '').replace(/^[\s,]+/, '');
    }
    role = role.replace(/^,+/, '').trim();
    return {
      name,
      url: link?.getAttribute('href') ?? null,
      role: role.length > 0 ? role : null,
      remote: /\(Remote\)/i.test(fullText),
    };
  }).filter((s) => s.name.length > 0);
}

function parseSession(sessionEl: HTMLElement, day: ProgramDay): Session | null {
  const id = sessionEl.classNames.split(/\s+/).find((c) => /^session-\d+$/.test(c)) ?? null;

  const titleEl = sessionEl.querySelector('.session-title');
  const title = clean(titleEl?.text);
  if (!title) return null;
  const url = titleEl?.querySelector('a')?.getAttribute('href') ?? null;

  const timeEl = sessionEl.querySelector('.session-time');
  const roomEl = timeEl?.querySelector('.session-room');
  const roomText = clean(roomEl?.text);
  const timeText = clean(timeEl?.text).replace(roomText, '').trim();

  const timeMatch = timeText.match(/^(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})\s*CET\s*(?:\[([^\]]+)\])?/i);
  if (!timeMatch) return null;
  const [, start, end, bracket] = timeMatch;

  let typeLabel = clean(bracket ?? '');
  let language: string | null = null;
  const langMatch = typeLabel.match(/\s+in\s+(\w+)$/i);
  if (langMatch) {
    language = langMatch[1];
    typeLabel = typeLabel.slice(0, langMatch.index).trim();
  }

  const roomMatch = roomText.match(/^In\s+(.+?)\s*\(([^)]+)\)\s*$/);

  return {
    id: id ?? `${day.id}-${start}-${title.slice(0, 24)}`,
    day: day.id,
    date: day.date,
    start,
    end,
    title,
    url,
    type: normalizeType(typeLabel) || 'Session',
    typeLabel: typeLabel || 'Session',
    language,
    room: roomMatch ? roomMatch[1].trim() : roomText.replace(/^In\s+/, ''),
    attendance: roomMatch ? roomMatch[2].trim() : null,
    speakers: parseSpeakers(sessionEl),
  };
}

/** Parses the raw view_CET.html page into structured program data. */
export function parseProgram(html: string): Program {
  const root = parse(html);

  const yearMatch = html.match(/View Conference (\d{4})/) ?? html.match(/VIEW Conference (\d{4})/);
  const year = yearMatch ? yearMatch[1] : String(new Date().getFullYear());
  const monthAbbr = html.match(/\d{1,2}\s*-\s*\d{1,2}\s+([A-Z]{3})/)?.[1] ?? 'OCT';
  const month = MONTHS[monthAbbr] ?? '10';

  const days: ProgramDay[] = [];
  const sessions: Session[] = [];
  let currentDay: ProgramDay | null = null;

  // Walk day headings and session blocks in document order.
  for (const el of root.querySelectorAll('h2.schedule-heading, div.session')) {
    if (el.classList.contains('schedule-heading')) {
      const dayMatch = el.text.match(/(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\s+(\d{1,2})(?:st|nd|rd|th)/);
      if (!dayMatch) continue;
      const [, weekday, dayNum] = dayMatch;
      const padded = dayNum.padStart(2, '0');
      currentDay = {
        id: String(Number(dayNum)),
        label: `${weekday} ${dayNum}th`,
        weekday,
        date: `${year}-${month}-${padded}`,
      };
      days.push(currentDay);
    } else if (currentDay) {
      const session = parseSession(el, currentDay);
      if (session) sessions.push(session);
    }
  }

  sessions.sort((a, b) => a.date.localeCompare(b.date) || a.start.localeCompare(b.start));

  const lastUpdatedMatch = html.match(/Updated\s+on\s+([^<]+)</);
  return {
    lastUpdated: lastUpdatedMatch ? clean(lastUpdatedMatch[1]) : null,
    fetchedAt: new Date().toISOString(),
    days,
    sessions,
  };
}
