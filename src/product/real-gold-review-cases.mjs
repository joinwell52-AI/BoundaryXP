import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateRealGoldReviewGates } from './real-gold-review-gates.mjs';
import { validateRealGoldResultConsistency, validateRealGoldSharedFacts } from './real-gold-result-consistency.mjs';
import { suggestRealGoldEvidenceSpans, validateRealGoldEvidenceRecord,
  validateRealGoldEvidenceReferences } from './real-gold-review-evidence.mjs';
import { calculationExpressions, calculationExplanationGaps, calculationExplanations,
  validateRealGoldPresentation } from './real-gold-presentation.mjs';
import { selectRealGoldReviewRevisions } from './real-gold-review-revisions.mjs';
import { assertReviewArtifactFiles, loadFrozenRealGoldSources, requiresFrozenRealGoldSources, resolveReviewSource,
  verifyFrozenRealGoldSource } from './real-gold-frozen-sources.mjs';

const slots = ['I', 'O', 'A', 'P', 'R', 'V', 'C', 'B'];
const defaultRoot = fileURLToPath(new URL('../../.boundx/real-gold-60-review/REAL-GOLD-60-REVIEW-20260918-r01/adjudications-r02/', import.meta.url));
const verifiedCases = new WeakMap();
const expectedCaseIds = Array.from({ length: 60 }, (_, index) => `REAL-GOLD-${String(index + 1).padStart(3, '0')}`);

export function realGoldReviewInventory(cases) {
  const counts = new Map();
  for (const entry of cases) counts.set(entry.case_id, (counts.get(entry.case_id) ?? 0) + 1);
  return {
    missing_case_ids: expectedCaseIds.filter(id => !counts.has(id)),
    duplicate_case_ids: [...counts].filter(([, count]) => count > 1).map(([id]) => id).sort(),
    unexpected_case_ids: [...counts.keys()].filter(id => !expectedCaseIds.includes(id)).sort(),
  };
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

export function isVerifiedRealGoldReviewCase(entry) {
  if (entry === null || typeof entry !== 'object' || !verifiedCases.has(entry)) return false;
  try { return verifiedCases.get(entry) === sha256(JSON.stringify(entry)); }
  catch { return false; }
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function requireValue(condition, message) {
  if (!condition) throw Error(message);
}

function verifiedSource(entry, manifest, baseline) {
  const sourcePath = resolveReviewSource(entry.path, manifest.source_file);
  const bytes = readFileSync(sourcePath);
  requireValue(sha256(bytes) === manifest.source_sha256, 'Review source hash mismatch');
  verifyFrozenRealGoldSource(baseline, entry.caseId, manifest, bytes);
  return new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes);
}

function loadQuarantinedSource(entry, reason, baseline) {
  assertReviewArtifactFiles(entry.path, ['MANIFEST.json']);
  const manifest = readJson(join(entry.path, 'MANIFEST.json'));
  requireValue(manifest.case_id === entry.caseId && manifest.revision === entry.revision,
    'Quarantined source identity mismatch');
  const source = verifiedSource(entry, manifest, baseline);
  let evidenceSpanSuggestions = [];
  if (baseline !== null && existsSync(join(entry.path, 'EVIDENCE.json'))) {
    try {
      assertReviewArtifactFiles(entry.path, ['EVIDENCE.json']);
      const evidence = readJson(join(entry.path, 'EVIDENCE.json'));
      if (evidence.case_id === entry.caseId && evidence.source_sha256 === manifest.source_sha256
        && evidence.status === 'EVIDENCE_VERIFIED') {
        evidenceSpanSuggestions = suggestRealGoldEvidenceSpans(source, evidence.evidence, manifest.source_sha256);
      }
    } catch { evidenceSpanSuggestions = []; }
  }
  return { case_id: entry.caseId, title: manifest.source_task_id, category: 'Real Gold 60',
    purpose: reason, reviewed: false, review_status: 'REVIEW_INVALID', revision: entry.revision,
    input: { source_text: source }, source: { file: manifest.source_file,
      chars: [...source].length, sha256: manifest.source_sha256 }, gold: null,
    ...(evidenceSpanSuggestions.length ? { evidence_span_suggestions: evidenceSpanSuggestions } : {}) };
}

function loadReviewedCase(entry, baseline) {
  const required = ['GOLD.zh-CN.md', 'GOLD.en.md', 'MANIFEST.json', 'GOLD.json', 'EVIDENCE.json',
    'FORMAL-MODEL.json', 'RESULT.json', 'REVIEW.json'];
  if (required.some((file) => !existsSync(join(entry.path, file)))) return null;
  assertReviewArtifactFiles(entry.path, required);
  const manifest = readJson(join(entry.path, 'MANIFEST.json'));
  const gold = readJson(join(entry.path, 'GOLD.json'));
  const evidence = readJson(join(entry.path, 'EVIDENCE.json'));
  const formal = readJson(join(entry.path, 'FORMAL-MODEL.json'));
  const result = readJson(join(entry.path, 'RESULT.json'));
  const review = readJson(join(entry.path, 'REVIEW.json'));
  const source = verifiedSource(entry, manifest, baseline);
  requireValue(manifest.case_id === entry.caseId && manifest.revision === entry.revision
    && manifest.generation_status === review.final_status && manifest.admin_gold_frozen === false
    && gold.case_id === entry.caseId && formal.case_id === entry.caseId
    && result.case_id === entry.caseId && review.case_id === entry.caseId, 'Review case identity mismatch');
  const factIssues = validateRealGoldSharedFacts(manifest, gold, formal, result, review);
  requireValue(factIssues.length === 0, `Review machine facts mismatch: ${factIssues.join('; ')}`);
  requireValue(validateRealGoldResultConsistency(result).length === 0, 'Review result consistency mismatch');
  requireValue(Array.isArray(formal.formal_coverage_gap) && formal.formal_coverage_gap.length === 0, 'FormalCoverageGap is not empty');
  requireValue(Array.isArray(formal.invented_constraints) && formal.invented_constraints.length === 0, 'Review contains invented constraints');
  requireValue(validateRealGoldReviewGates(review) === null, 'Review gates or status invalid');
  const evidenceIssues = validateRealGoldEvidenceRecord(source, evidence, entry.caseId, manifest.source_sha256);
  requireValue(evidenceIssues.length === 0, `Review evidence record mismatch: ${evidenceIssues.join('; ')}`);
  const referenceIssues = validateRealGoldEvidenceReferences(gold.slots, evidence.evidence);
  requireValue(referenceIssues.length === 0, `Review evidence references unresolved: ${referenceIssues.join('; ')}`);
  const presentationIssues = validateRealGoldPresentation({
    'zh-CN': readFileSync(join(entry.path, 'GOLD.zh-CN.md'), 'utf8'),
    en: readFileSync(join(entry.path, 'GOLD.en.md'), 'utf8'),
  }, manifest, gold, evidence, formal, result, review);
  requireValue(presentationIssues.length === 0, `Review bilingual presentation mismatch: ${presentationIssues.join('; ')}`);
  for (const slot of slots) requireValue(gold.slots?.[slot], `Missing ${slot} review slot`);
  const ir = Object.fromEntries(slots.map((slot) => {
    const value = gold.slots[slot];
    return [slot, { ...value, evidence: value.evidence.map((id) => evidence.evidence.find((item) => item.evidence_id === id)) }];
  }));
  return {
    case_id: entry.caseId,
    title: manifest.source_task_id,
    category: 'Real Gold 60',
    purpose: review.final_reason_zh,
    reviewed: review.final_status === 'GOLD_REVIEW_PASSED',
    review_status: review.final_status,
    revision: entry.revision,
    input: { source_text: source },
    source: { file: manifest.source_file, chars: [...source].length, sha256: manifest.source_sha256 },
    gold: {
      ir_7plus1: ir,
      evidence_trace: Object.fromEntries(slots.map((slot) => [slot, ir[slot].evidence])),
      formal_boundary_model: formal,
      calculation_formulas: calculationExpressions(readFileSync(join(entry.path, 'GOLD.zh-CN.md'), 'utf8')),
      calculation_explanation_gaps: {
        'zh-CN': calculationExplanationGaps(readFileSync(join(entry.path, 'GOLD.zh-CN.md'), 'utf8')),
        en: calculationExplanationGaps(readFileSync(join(entry.path, 'GOLD.en.md'), 'utf8')),
      },
      calculation_explanations: {
        'zh-CN': calculationExplanations(readFileSync(join(entry.path, 'GOLD.zh-CN.md'), 'utf8')),
        en: calculationExplanations(readFileSync(join(entry.path, 'GOLD.en.md'), 'utf8')),
      },
      mathematical_assertions: [
        `Missing_task = ${JSON.stringify(result.Missing_task)}`,
        `ForbiddenConflict = ${JSON.stringify(result.ForbiddenConflict)}`,
        `Consistency = ${result.Consistency}`,
        `CompletionDecidable = ${result.CompletionDecidable}`,
        `SolutionSpace = ${result.SolutionSpace}`,
        `BoundaryUnique = ${result.BoundaryUnique}`,
      ],
      boundary_result: { state: result.boundary_state, canonical_boundary_candidates: result.canonical_boundary_candidates, legal_execution_paths_cardinality: result.legal_execution_paths_cardinality },
      result,
      admission: { policy_evaluation: result.PolicyEvaluation, status: result.admission },
      review_gates: review.gates,
      diagnostic_code: review.final_status,
      rationale: review.final_reason_zh,
      negative_oracle: 'Source、Context、Ontology、Profile 未提供的事实不补造；ADMIN_GOLD_FROZEN 不由本视图或本次审定生成。',
    },
  };
}

export function loadRealGoldReviewCases(root = process.env.BOUNDX_REAL_GOLD_REVIEW_ROOT ?? defaultRoot) {
  const cases = [], excluded = [], quarantinedSources = [];
  const baseline = loadFrozenRealGoldSources(root, { required: requiresFrozenRealGoldSources(root) });
  const selection = selectRealGoldReviewRevisions(resolve(root));
  function quarantine(entry, reason) {
    try {
      const source = loadQuarantinedSource(entry, reason, baseline);
      quarantinedSources.push(source);
      excluded.push({ case_id: entry.caseId, revision: entry.revision, reason,
        ...(source.evidence_span_suggestions?.length
          ? { evidence_span_suggestions: source.evidence_span_suggestions } : {}) });
    } catch { excluded.push({ case_id: entry.caseId, revision: entry.revision, reason }); }
  }
  for (const entry of selection.directories) {
    try {
      const loaded = loadReviewedCase(entry, baseline);
      if (loaded) {
        verifiedCases.set(loaded, sha256(JSON.stringify(loaded)));
        cases.push(loaded);
      }
      else quarantine(entry, 'REVIEW_OUTPUTS_MISSING');
    } catch (error) {
      quarantine(entry, error.message);
    }
  }
  cases.sort((left, right) => left.case_id.localeCompare(right.case_id));
  const reviewedCases = cases.filter(entry => entry.reviewed).length;
  const presentationIncompleteCases = cases.filter(entry => Object.values(entry.gold.calculation_explanation_gaps)
    .some(gaps => gaps.length)).map(entry => entry.case_id);
  const inventory = realGoldReviewInventory(cases);
  return {
    dataset: 'BoundX Real Gold 60 review',
    dataset_version: 'r01',
    status: 'GOLD_REVIEW_IN_PROGRESS',
    admin_gold_frozen: false,
    suite_kind: 'real-gold-review',
    cases,
    quarantined_sources: quarantinedSources,
    distribution: { 'Real Gold 60': cases.length + quarantinedSources.length },
    verification: {
      suite_id: 'real-gold-60-review-r01',
      case_count: cases.length,
      expected_case_count: 60,
      reviewed_cases: reviewedCases,
      presentation_complete: presentationIncompleteCases.length === 0 && reviewedCases === 60,
      presentation_incomplete_cases: presentationIncompleteCases,
      frozen_source_baseline: baseline === null ? 'unavailable' : 'checked_against_candidate_source_bytes',
      integrity: baseline === null || selection.selection_errors.length || excluded.length || inventory.missing_case_ids.length || inventory.duplicate_case_ids.length
        || inventory.unexpected_case_ids.length || reviewedCases !== 60 || presentationIncompleteCases.length ? 'partial' : 'verified',
      ...inventory,
      selection_sha256: selection.selection_sha256,
      selection_errors: selection.selection_errors,
      unselected_revisions: selection.unselected_revisions,
      excluded_cases: excluded,
      admin_gold_frozen: false,
      note: 'Only mechanically replayable review revisions are displayed; drafts remain drafts and candidates are not presented as reviewed.',
    },
  };
}
