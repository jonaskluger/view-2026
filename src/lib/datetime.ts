/** Current wall time in Europe/Rome (the conference timezone). */
export function getRomeNow(): { date: string; hm: string } {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Rome',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date());

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return {
    date: `${get('year')}-${get('month')}-${get('day')}`,
    hm: `${get('hour')}:${get('minute')}`,
  };
}

/** "09:00" / "10:15" — string compare works for zero-padded HH:MM. */
export function isOngoing(start: string, end: string, hm: string, sessionDate: string, today: string): boolean {
  return sessionDate === today && start <= hm && hm < end;
}

export function formatTimeRange(start: string, end: string): string {
  return `${start}–${end}`;
}
