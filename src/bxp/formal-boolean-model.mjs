import { boundedJson } from './validation.mjs';
import { digest, sourceDigest } from './evaluate.mjs';
import { solveBooleanConstraints, validateBooleanConstraints } from './boolean-solver.mjs';

const collections = ['required', 'forbidden', 'completion', 'constraints'];
const exact = (value, fields) => value !== null && typeof value === 'object' && !Array.isArray(value)
  && Object.keys(value).length === fields.length && fields.every(field => Object.hasOwn(value, field));
const identifier = value => typeof value === 'string' && value.length > 0 && value.length <= 128;

export function compileBooleanModelFragment(input) {
  const invalid = code => ({ format: 'boundx-formal-boolean-fragment/experimental-v1',
    status: 'invalid', model: null, calculation: null, diagnostics: [code],
    boundary_result: null, admission: null, business_decision: null, execution_authorization: null });
  if (!boundedJson(input) || !exact(input, ['source', 'scope', 'variables', ...collections])
    || !exact(input.source, ['text', 'language']) || typeof input.source.text !== 'string'
    || !input.source.text.length || !identifier(input.source.language)
    || !exact(input.scope, ['id', 'status', 'evidence']) || !identifier(input.scope.id)
    || !['resolved', 'unresolved'].includes(input.scope.status)
    || !Array.isArray(input.variables) || input.variables.length > 12
    || input.variables.some(variable => !identifier(variable))
    || new Set(input.variables).size !== input.variables.length) return invalid('FRAGMENT_INPUT_INVALID');
  const points = Array.from(input.source.text);
  const evidenceValid = spans => Array.isArray(spans) && spans.length > 0 && spans.length <= 32
    && spans.every(span => exact(span, ['start', 'end', 'quote'])
      && Number.isSafeInteger(span.start) && Number.isSafeInteger(span.end)
      && span.start >= 0 && span.end > span.start && span.end <= points.length
      && typeof span.quote === 'string' && points.slice(span.start, span.end).join('') === span.quote);
  if (!evidenceValid(input.scope.evidence)) return invalid('SCOPE_EVIDENCE_INVALID');
  const ids = new Set();
  for (const collection of collections) {
    if (!Array.isArray(input[collection]) || input[collection].length > 64) return invalid('CLAUSE_COLLECTION_INVALID');
    for (const clause of input[collection]) {
      if (!exact(clause, ['id', 'status', 'formula', 'evidence']) || !identifier(clause.id) || ids.has(clause.id)
        || !['resolved', 'unresolved'].includes(clause.status)) return invalid('CLAUSE_INVALID');
      ids.add(clause.id);
      if (!evidenceValid(clause.evidence)) return invalid('CLAUSE_EVIDENCE_INVALID');
    }
  }
  const model = {
    source_digest: sourceDigest(input.source.text), language: input.source.language,
    scope: structuredClone(input.scope), variables: [...input.variables].sort(),
    ...Object.fromEntries(collections.map(collection => [collection,
      structuredClone(input[collection]).sort((left, right) => left.id < right.id ? -1 : left.id > right.id ? 1 : 0)])),
  };
  const compilation = collections.flatMap(collection => model[collection].map(clause => ({
    clause_id: clause.id, collection, scope_id: model.scope.id, status: clause.status,
    evidence: structuredClone(clause.evidence), input_formula: structuredClone(clause.formula),
    operator: collection === 'forbidden' ? 'exclude-forbidden-state' : 'require-predicate',
    effective_formula: collection === 'forbidden' ? { not: structuredClone(clause.formula) } : structuredClone(clause.formula),
  })));
  const formulas = compilation.map(node => node.effective_formula);
  try { validateBooleanConstraints(model.variables, formulas); }
  catch { return invalid('BOOLEAN_OPERATOR_INPUT_INVALID'); }
  const unresolved = [
    ...(model.scope.status === 'unresolved' ? ['SCOPE_UNRESOLVED'] : []),
    ...collections.flatMap(collection => model[collection].filter(clause => clause.status === 'unresolved')
      .map(clause => `CLAUSE_UNRESOLVED:${clause.id}`)),
  ];
  return { format: 'boundx-formal-boolean-fragment/experimental-v1',
    status: unresolved.length ? 'unresolved' : 'compiled', model, model_digest: digest(model),
    compilation,
    coverage: { submitted_clauses: ids.size, represented_clauses: compilation.length,
      scope: 'submitted_boolean_clauses_only', source_semantic_completeness: 'not_established' },
    calculation: unresolved.length ? null : solveBooleanConstraints(model.variables, formulas), diagnostics: unresolved,
    boundary_result: null, admission: null, business_decision: null, execution_authorization: null };
}
