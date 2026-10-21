import { canonicalBooleanBoundary } from './boolean-solver.mjs';
import { boundedJson } from './validation.mjs';
import { digest } from './evaluate.mjs';

export function compareBooleanBoundaries(input) {
  const output = (status, extra = {}) => ({ format: 'boundx.boolean-boundary-comparison/experimental-v1', status,
    coverage: 'submitted_boolean_interpretations_only', interpretation_exhaustiveness: 'not_established',
    boundary_result: null, admission: null, business_decision: null, execution_authorization: null, ...extra });
  if (!boundedJson(input) || !input || typeof input !== 'object' || Array.isArray(input)
    || Object.keys(input).length !== 2 || typeof input.scope_id !== 'string' || !input.scope_id.trim()
    || input.scope_id.length > 256 || !Array.isArray(input.interpretations)
    || input.interpretations.length < 2 || input.interpretations.length > 16) return output('invalid');
  const boundaries = [];
  try {
    for (const item of input.interpretations) {
      if (!item || typeof item !== 'object' || Array.isArray(item) || Object.keys(item).length !== 2
        || !Object.hasOwn(item, 'variables') || !Object.hasOwn(item, 'formulas')) return output('invalid');
      boundaries.push(canonicalBooleanBoundary(item.variables, item.formulas));
    }
  } catch (error) {
    return error instanceof RangeError ? output('not_evaluated', { reason: 'CANONICALIZATION_WORK_LIMIT' }) : output('invalid');
  }
  const universe = JSON.stringify(boundaries[0].variables);
  if (boundaries.some(boundary => JSON.stringify(boundary.variables) !== universe)) {
    return output('not_comparable', { reason: 'BOOLEAN_IDENTITY_UNIVERSE_MISMATCH' });
  }
  const digests = boundaries.map(boundary => digest({ scope_id: input.scope_id, ...boundary }));
  const different = digests.findIndex(value => value !== digests[0]);
  let counterexample = null;
  if (different !== -1) {
    const first = boundaries[0];
    const other = boundaries[different];
    const mask = [...first.membership].findIndex((value, index) => value !== other.membership[index]);
    counterexample = { left_interpretation: 0, right_interpretation: different,
      values: Object.fromEntries(first.variables.map((name, bit) => [name, Boolean(mask & (1 << (first.variables.length - bit - 1)))])),
      left_admitted: first.membership[mask] === '1', right_admitted: other.membership[mask] === '1' };
  }
  return output(different === -1 ? 'equivalent' : 'different', { scope_id: input.scope_id,
    canonical_boundaries: boundaries, boundary_digests: digests,
    distinct_boundary_count: new Set(digests).size, counterexample });
}
