/**
 * Regenerates public/program-snapshot.json from the live source.
 * The snapshot is committed to the repo and used as an offline/error
 * fallback when the live API cannot be reached. Runs before every build.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getProgram } from '../src/lib/programService';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public');
const outFile = join(outDir, 'program-snapshot.json');

const program = await getProgram();
mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, JSON.stringify(program, null, 2));
console.log(`Snapshot written: ${program.sessions.length} sessions across ${program.days.length} days (updated: ${program.lastUpdated ?? 'unknown'})`);
