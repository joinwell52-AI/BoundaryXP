import { createHash } from 'node:crypto';
import { existsSync, lstatSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const caseIdPattern = /^REAL-GOLD-\d{3}$/u;
const revisionPattern = /^rev[1-9]\d*$/u;
const selectionFile = 'ACTIVE-REVISIONS.json';
const isDirectory = path => existsSync(path) && lstatSync(path).isDirectory();

export function selectRealGoldReviewRevisions(root) {
  const directories = isDirectory(root) ? readdirSync(root)
    .filter(caseId => caseIdPattern.test(caseId) && isDirectory(join(root, caseId)))
    .flatMap(caseId => readdirSync(join(root, caseId))
      .filter(revision => isDirectory(join(root, caseId, revision)))
      .map(revision => ({ caseId, revision, path: join(root, caseId, revision) }))) : [];
  const path = join(root, selectionFile);
  if (!existsSync(path)) return { directories, unselected_revisions: [], selection_errors: [], selection_sha256: null };
  if (!lstatSync(path).isFile()) return { directories: [], unselected_revisions: [],
    selection_errors: ['SELECTION_FILE_UNSAFE'], selection_sha256: null };
  const bytes = readFileSync(path);
  const selection_sha256 = createHash('sha256').update(bytes).digest('hex');
  let selection;
  try { selection = JSON.parse(bytes.toString('utf8')); }
  catch { return { directories: [], unselected_revisions: [], selection_errors: ['SELECTION_JSON_INVALID'], selection_sha256 }; }
  if (!selection || Array.isArray(selection) || typeof selection !== 'object'
    || Object.keys(selection).length !== 2 || selection.format !== 'boundx-real-gold-active-revisions/v1'
    || !selection.revisions || Array.isArray(selection.revisions) || typeof selection.revisions !== 'object') {
    return { directories: [], unselected_revisions: [], selection_errors: ['SELECTION_FORMAT_INVALID'], selection_sha256 };
  }
  const selected = selection.revisions;
  const selection_errors = Object.entries(selected).flatMap(([caseId, revision]) => {
    if (!caseIdPattern.test(caseId) || typeof revision !== 'string' || !revisionPattern.test(revision)) {
      return [caseIdPattern.test(caseId) ? `SELECTION_ID_INVALID:${caseId}` : 'SELECTION_ID_INVALID'];
    }
    if (!directories.some(entry => entry.caseId === caseId && entry.revision === revision)) {
      return [`SELECTION_REVISION_MISSING:${caseId}:${revision}`];
    }
    return [];
  });
  if (selection_errors.length) return { directories: [], unselected_revisions: [], selection_errors, selection_sha256 };
  return { directories: directories.filter(entry => !Object.hasOwn(selected, entry.caseId)
      || selected[entry.caseId] === entry.revision),
    unselected_revisions: directories.filter(entry => Object.hasOwn(selected, entry.caseId)
      && selected[entry.caseId] !== entry.revision).map(({ caseId, revision }) => ({ case_id: caseId, revision })),
    selection_errors, selection_sha256 };
}
