/**
 * Best-effort persistent storage. On mobile browsers, storage marked
 * persistent is protected from automatic eviction under storage pressure,
 * which keeps favorites and the cached program safe between sessions.
 * Fails silently where the API is missing or permission is denied.
 */
export async function requestPersistentStorage(): Promise<void> {
  try {
    if (navigator.storage?.persist && !(await navigator.storage.persisted())) {
      await navigator.storage.persist();
    }
  } catch {
    // non-fatal
  }
}
