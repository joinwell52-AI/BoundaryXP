import { assert, parseProductJson } from './contracts.mjs';

export function industrySelection(registry, input) {
  const value = parseProductJson(JSON.stringify(input));
  assert(value && Object.keys(value).every(key => ['operation', 'reference'].includes(key))
    && ['activate', 'deactivate'].includes(value.operation), 'SELECTION_INPUT', 'Explicit industry activation or deactivation is required.');
  const pack = registry.load(value.reference);
  assert(pack.descriptor.boundx.layer === 'L2', 'SELECTION_LAYER', 'Select an installed industry package, not L1 or a customer directory.');
  registry[value.operation](value.reference);
  return { active: registry.active(), selected: value.operation === 'activate' ? value.reference : null,
    business_decision: null, execution_authorization: null };
}
