import { useCallback, useEffect, useState } from 'react';

const FAVORITES_KEY = 'view-2026-favorites';

function readFavorites(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

/**
 * Favorite session ids, persisted in localStorage.
 * `favorites` is a Set for O(1) lookups when rendering lists.
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(() => new Set(readFavorites()));

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]));
    } catch {
      // storage full or unavailable — non-fatal
    }
  }, [favorites]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const isFavorite = useCallback((id: string) => favorites.has(id), [favorites]);

  return { favorites, toggleFavorite, isFavorite };
}
