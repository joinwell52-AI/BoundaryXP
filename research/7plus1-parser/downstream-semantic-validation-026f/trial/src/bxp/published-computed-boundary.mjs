import { boundedJson } from './validation.mjs';
import { digest } from './evaluate.mjs';
import { checkAdmissionBinding } from './admission-binding.mjs';
import { evaluateReleaseConditions } from './admission-assessment.mjs';
import { evaluateScopeGauge } from './scope-gauge.mjs';
import { registeredValidator } from './schema-registry.mjs';
import { buildTypedEvidenceArtifacts } from '../product/typed-evidence-artifacts.mjs';

const validateAdmission = registeredValidator('admission_assessment');

export function verifyPublishedComputedBoundary(published) {
  const fail = reason => ({ status: 'invalid', reason, computed_boundary: null,
    business_decision: null, execution_authorization: null });
  if (!boundedJson(published) || !published?.record?.snapshot || published.release?.admission?.status !== 'admitted') {
    return fail('PUBLISHED_RECORD_INVALID');
  }
  const { record, release } = published;
  const { snapshot } = record;
  if (release.revision !== record.revision || snapshot.ir?.task_revision !== record.revision
    || release.task_id !== snapshot.ir?.task_id || release.record_digest !== digest(record)
    || digest(release.binding) !== digest(record.stored_binding)
    || checkAdmissionBinding(record.stored_binding, snapshot).status !== 'matched'
    || snapshot.boundary?.state !== 'determined' || snapshot.computed_boundary?.state !== 'determined') {
    return fail('PUBLISHED_BINDING_INVALID');
  }
  if (!Array.isArray(snapshot.ir.sources) || !Array.isArray(snapshot.source.context_sources)
    || snapshot.ir.sources.some(source => !source || typeof source !== 'object'
      || typeof source.role !== 'string' || typeof source.text !== 'string'
      || typeof source.language !== 'string')) {
    return fail('PUBLISHED_SOURCE_SNAPSHOT_MISMATCH');
  }
  const taskSource = snapshot.ir.sources.find(source => source.role === 'task');
  if (!taskSource || snapshot.source.text !== taskSource.text || snapshot.source.language !== taskSource.language
    || digest(snapshot.source.context_sources) !== digest(snapshot.ir.sources.filter(source => source.role !== 'task'))) {
    return fail('PUBLISHED_SOURCE_SNAPSHOT_MISMATCH');
  }
  let current;
  try {
    const request = { ir: snapshot.ir, formalization: snapshot.formalization_inputs };
    current = evaluateScopeGauge({ request, ...buildTypedEvidenceArtifacts(request) },
      snapshot.profile.content.boundary_profile, snapshot.selection);
  } catch { return fail('PUBLISHED_COMPUTED_BOUNDARY_REPLAY_FAILED'); }
  if (digest(current.typed_analysis.compilation.model) !== digest(snapshot.formal_model)) {
    return fail('PUBLISHED_FORMAL_MODEL_REPLAY_MISMATCH');
  }
  if (digest(current.computed_boundary) !== digest(snapshot.computed_boundary)
    || digest(current.typed_analysis.boundary_result) !== digest(snapshot.boundary)) {
    return fail('PUBLISHED_COMPUTED_BOUNDARY_REPLAY_MISMATCH');
  }
  const binding = checkAdmissionBinding(record.stored_binding, snapshot);
  if (!validateAdmission(release.admission)
    || release.admission.boundary_state !== current.computed_boundary.state
    || digest(release.admission.binding) !== digest(binding)
    || evaluateReleaseConditions(snapshot, release.release_observations).length) {
    return fail('PUBLISHED_ADMISSION_RECORD_MISMATCH');
  }
  return { status: 'verified', reason: 'EXACT_PUBLISHED_BOUNDARY_REPLAY',
    computed_boundary: structuredClone(snapshot.computed_boundary),
    business_decision: null, execution_authorization: null };
}
