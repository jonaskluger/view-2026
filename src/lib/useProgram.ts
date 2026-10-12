import { useCallback, useEffect, useState } from 'react';
import type { Program } from '../types';

export type ProgramSource = 'live' | 'snapshot' | 'cache';

interface ProgramState {
  program: Program | null;
  source: ProgramSource | null;
  loading: boolean;
  error: string | null;
}

const CACHE_KEY = 'view-2026-program';

function readCache(): Program | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as Program) : null;
  } catch {
    return null;
  }
}

function writeCache(program: Program) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(program));
  } catch {
    // storage full or unavailable — non-fatal
  }
}

/**
 * Loads the program with a resilience chain:
 *   1. cached data is shown instantly (survives flaky conference wifi)
 *   2. /api/program (live, CDN-cached for 15 min) is fetched and persisted
 *   3. /program-snapshot.json (build-time snapshot) is the fallback
 */
export function useProgram() {
  const [state, setState] = useState<ProgramState>(() => {
    const cached = readCache();
    return {
      program: cached,
      source: cached ? 'cache' : null,
      loading: true,
      error: null,
    };
  });

  const refresh = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const res = await fetch('/api/program', { headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(`API responded ${res.status}`);
      const program = (await res.json()) as Program;
      if (!program.sessions?.length) throw new Error('API returned an empty program');
      writeCache(program);
      setState({ program, source: 'live', loading: false, error: null });
    } catch (liveErr) {
      try {
        const res = await fetch('/program-snapshot.json');
        if (!res.ok) throw new Error(`Snapshot responded ${res.status}`);
        const program = (await res.json()) as Program;
        writeCache(program);
        setState((s) => ({
          program,
          source: 'snapshot',
          loading: false,
          error: s.program ? null : `Live fetch failed: ${liveErr instanceof Error ? liveErr.message : liveErr}`,
        }));
      } catch (snapErr) {
        setState((s) => ({
          ...s,
          loading: false,
          error: s.program
            ? 'Showing cached data — live update failed.'
            : `Could not load the program: ${snapErr instanceof Error ? snapErr.message : snapErr}`,
        }));
      }
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { ...state, refresh };
}
