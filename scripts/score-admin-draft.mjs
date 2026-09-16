import { lstatSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { scoreReviewDraft } from '../src/product/draft-score.mjs';
import { loadReviewWorkspaceCase } from './prepare-admin-review.mjs';

export function scoreDraftFile(workspace, caseId, candidatePath) {
  const { host, draft, seed, snapshotTime } = loadReviewWorkspaceCase(workspace, caseId);
  let observation = null;
  if (candidatePath !== '--missing') {
    const stat = lstatSync(candidatePath);
    if (!stat.isFile() || stat.isSymbolicLink() || stat.size > 2_000_000) throw Error('Invalid candidate file.');
    observation = readFileSync(candidatePath);
  }
  return scoreReviewDraft(host, draft, seed, snapshotTime, observation);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args = process.argv.slice(2);
    if (args.length !== 3) throw Error('Expected workspace, case ID and candidate file or --missing.');
    const result = scoreDraftFile(...args);
    process.stdout.write(JSON.stringify(result, null, 2) + '\n');
    process.exitCode = result.observation_status === 'NOT_SCORED' ? 1 : 0;
  } catch {
    process.stderr.write('Draft comparison failed; no score or review approval was produced.\n');
    process.exitCode = 1;
  }
}
