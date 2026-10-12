import { useEffect, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';

/**
 * Shows a small toast when a new version of the app has been downloaded
 * and is ready. Tapping it activates the new service worker and reloads.
 */
export function ReloadPrompt() {
  const [needRefresh, setNeedRefresh] = useState(false);

  useEffect(() => {
    const updateSW = registerSW({
      onNeedRefresh() {
        setNeedRefresh(true);
      },
      onOfflineReady() {
        // App is cached for offline use — nothing to announce.
      },
    });
    return () => {
      // registerSW returns an updater; no explicit cleanup needed,
      // but keep a reference so HMR doesn't double-register.
      void updateSW;
    };
  }, []);

  if (!needRefresh) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-sm items-center justify-between gap-3 rounded-2xl bg-zinc-800 p-3.5 text-sm shadow-xl ring-1 ring-zinc-700">
      <span className="text-zinc-200">New version ready</span>
      <div className="flex gap-2">
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-orange-500 px-3 py-1.5 font-semibold text-zinc-950 transition active:scale-95"
        >
          Update
        </button>
        <button
          onClick={() => setNeedRefresh(false)}
          className="rounded-lg px-3 py-1.5 text-zinc-400 transition hover:text-zinc-200"
        >
          Later
        </button>
      </div>
    </div>
  );
}
