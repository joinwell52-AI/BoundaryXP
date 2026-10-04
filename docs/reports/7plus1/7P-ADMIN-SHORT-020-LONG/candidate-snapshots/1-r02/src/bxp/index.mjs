import { readFileSync } from 'node:fs';
import { evaluateTask, CORE_ELEMENTS, PROTOCOL_VERSION } from './evaluate.mjs';
import { boundedJson, taskSchema, resultSchema, suiteSchema, validateResultSchema } from './validation.mjs';
import { parseStrictJson } from './raw-json.mjs';

export { CORE_ELEMENTS, PROTOCOL_VERSION, taskSchema, resultSchema, suiteSchema, parseStrictJson };
export { digest, sourceDigest } from './evaluate.mjs';
export { evaluateWithTrace } from './trace.mjs';
export { evaluateBoundaryDraft } from './boundary-draft.mjs';
export { validateSemanticIr } from './semantic-ir.mjs';
export { compileSemanticIr } from './semantic-ir-compiler.mjs';
export { compareBooleanBoundaries } from './boolean-boundary-comparison.mjs';
export { verifyTypedBoundaryReplay } from './typed-boundary-replay.mjs';
export { evaluateTypedBoundary, createTypedBoundaryEvaluator, parseAndEvaluateTypedBoundary, validateTypedBoundaryStructure } from './typed-boundary.mjs';
export { evaluateScopeGauge } from './scope-gauge.mjs';
export { verifyScopeGaugeReplay } from './scope-gauge-replay.mjs';
export { verifyPublishedComputedBoundary } from './published-computed-boundary.mjs';
export { checkPublishedRuntimeBoundary } from './published-runtime-check.mjs';
export { createRuntimeBoundaryChecker } from './runtime-boundary-check.mjs';
export { realGoldReplayRecords } from '../product/real-gold-replay.mjs';
export { contractInventory } from './schema-registry.mjs';
export { validateSemanticResourceManifest, verifySemanticResource, loadSemanticResourceManifest } from '../product/semantic-resources.mjs';
export { assembleEffectiveSemanticLibrary, assembleActiveSemanticLibrary } from '../product/effective-semantic-library.mjs';
export { buildEvidenceGraph } from '../product/evidence-graph.mjs';
export { createAdmissionBinding, checkAdmissionBinding } from './admission-binding.mjs';
export { RAW_JSON_BYTE_LIMIT } from './raw-json.mjs';
export const PRODUCT_VERSION = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8')).version;
export const CONFORMANCE_SUITE_VERSION = suiteSchema.properties.suite_version.const;
export const evaluateBxpTask = evaluateTask;
export function validateBxpTask(task) {
  const result = evaluateBxpTask(task);
  return { valid: result.evaluation.validation === 'valid', findings: result.findings.filter(item => item.status === 'invalid') };
}
export function validateBxpResult(result) {
  return boundedJson(result) && validateResultSchema(result);
}
export function parseAndEvaluateBxpTask(raw) {
  let task;
  try { task = parseStrictJson(raw); } catch { return evaluateBxpTask(undefined); }
  return evaluateBxpTask(task);
}
export function protocolInfo() {
  return { product_version: PRODUCT_VERSION, protocol_version: PROTOCOL_VERSION,
    schema_ids: { task: taskSchema.$id, result: resultSchema.$id, suite: suiteSchema.$id },
    suite_version: CONFORMANCE_SUITE_VERSION, core_elements: [...CORE_ELEMENTS],
    conformance_classes: ['BXP-IR', 'BXP-CALC'], extraction_conformance: 'RESERVED',
    business_decision: null, execution_authorization: null };
}
export { canonicalizeTypedInterpretation, compareTypedInterpretations } from './typed-interpretations.mjs';
export { evaluateTypedAdmission } from './typed-admission.mjs';
export { evaluateDownstreamConformance } from './downstream-conformance.mjs';
