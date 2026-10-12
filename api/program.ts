import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getProgram } from '../src/lib/programService';

/**
 * Live program endpoint.
 * Fetches and parses the official VIEW schedule on demand; the Vercel CDN
 * caches the JSON for 15 minutes and serves stale content while revalidating,
 * so the app picks up daily schedule changes without a redeploy.
 */
export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const program = await getProgram();
    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=86400');
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(program);
  } catch (err) {
    res.status(502).json({
      error: 'Failed to fetch the live program',
      detail: err instanceof Error ? err.message : String(err),
    });
  }
}
