import { evaluateTask, digest, PROTOCOL_VERSION } from './evaluate.mjs';

const methods = Object.freeze({
  intervals: { method: 'interval-intersection', formula: 'intersection(intervals with identical scope, subject, dimension, unit, domain)' },
  target_sets: { method: 'forbidden-set-intersection', formula: 'requested intersect forbidden' },
  handoffs: { method: 'required-input-difference', formula: 'required_inputs minus (declared_outputs union external_inputs)' },
  dependencies: { method: 'prerequisite-cycle-detection', formula: 'cycles in prerequisite graph within scope' },
  logic: { method: 'propositional-satisfiability', formula: 'exists valuation satisfying all formulas and assumptions within scope' },
});

export function evaluateWithTrace(task) {
  const started = performance.now();
  const result = evaluateTask(task);
  const evaluation_ms = performance.now() - started;
  const valid = result.evaluation.validation === 'valid';
  const steps = [];
  if (valid) {
    steps.push({ method: 'required-element-difference', formula: 'required_elements minus resolved_elements',
      status: 'evaluated', inputs: { required: task.profile.required_elements, resolved: result.resolved_elements },
      output: result.deficit });
    for (const [kind, definition] of Object.entries(methods)) {
      const items = task.constraints[kind] ?? [];
      const outputs = result.calculations[kind];
      for (const output of outputs) {
        const inputs = items.filter(item => output.constraint_ids ? output.constraint_ids.includes(item.id)
          : output.id ? item.id === output.id
            : (item.scope_id ?? 'task') === output.scope_id);
        steps.push({ ...definition, kind, scope_id: output.scope_id,
          status: !inputs.length ? 'not_applicable' : output.result === 'undetermined' ? 'unresolved' : 'evaluated', inputs,
          evidence: inputs.flatMap(item => item.evidence ?? []), output });
      }
      for (const item of items) {
        const scope = task.scopes?.find(value => value.id === item.scope_id);
        if (scope?.identity_status === 'unresolved') steps.push({ ...definition, kind,
          scope_id: item.scope_id, status: 'not_evaluated', reason: 'SCOPE_UNRESOLVED', inputs: [item], output: null,
          evidence: [...(scope.evidence ?? []), ...(item.evidence ?? [])] });
      }
      if (!items.length && !outputs.length) steps.push({ ...definition, kind, status: 'not_applicable', inputs: [], output: null });
    }
  }
  return { result, trace: { format: 'boundx-calculation-trace/experimental-v1',
    protocol_version: PROTOCOL_VERSION, input_digest: result.input_digest, result_digest: digest(result),
    status: valid ? 'calculated' : 'not_calculated', evaluation_ms,
    steps: structuredClone(steps), findings: structuredClone(result.findings),
    boundary_04: null, admission_04: null,
    limitation: 'Trace explains the current Core only; it does not assert BXP 0.4 conformance or extraction completeness.' } };
}
