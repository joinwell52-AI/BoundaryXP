export function validateRealGoldResultConsistency(result) {
  const stringList = value => Array.isArray(value)
    && value.every(item => typeof item === 'string' && item.trim().length > 0);
  if (!result || typeof result !== 'object' || Array.isArray(result)
    || !['determined', 'underdetermined', 'inconsistent', 'invalid'].includes(result.boundary_state)
    || typeof result.BoundaryUnique !== 'boolean'
    || !['NONEMPTY', 'EMPTY', 'UNRESOLVED'].includes(result.SolutionSpace)
    || !stringList(result.Missing_task)
    || !stringList(result.ForbiddenConflict)
    || !['PASS', 'FAIL', 'UNRESOLVED'].includes(result.Consistency)
    || !['PASS', 'FAIL', 'UNRESOLVED'].includes(result.CompletionDecidable)
    || !Number.isSafeInteger(result.canonical_boundary_candidates)
    || result.canonical_boundary_candidates < 0
    || typeof result.PolicyEvaluation !== 'string' || !result.PolicyEvaluation.trim()
    || typeof result.admission !== 'string' || !result.admission.trim()) {
    return ['RESULT_CONTRACT_INVALID'];
  }
  const issues = [];
  for (const [field, entries] of [['MissingTaskDetails', result.Missing_task],
    ['ForbiddenConflictDetails', result.ForbiddenConflict]]) {
    if (!Object.hasOwn(result, field)) continue;
    const details = result[field];
    if (!details || typeof details !== 'object' || Array.isArray(details)
      || Object.keys(details).length !== entries.length
      || entries.some(id => !Object.hasOwn(details, id) || !details[id]
        || typeof details[id] !== 'object' || Array.isArray(details[id])
        || Object.keys(details[id]).length !== 2
        || ['zh-CN', 'en'].some(language => typeof details[id][language] !== 'string'
          || !details[id][language].trim()))) {
      issues.push('RESULT_BILINGUAL_DETAIL_MISMATCH');
    }
  }
  if (result.BoundaryUnique !== (result.boundary_state === 'determined')) {
    issues.push('RESULT_BOUNDARY_UNIQUENESS_MISMATCH');
  }
  if ((result.SolutionSpace === 'EMPTY') !== (result.boundary_state === 'inconsistent')) {
    issues.push('RESULT_SOLUTION_SPACE_MISMATCH');
  }
  if (result.boundary_state === 'determined' && result.canonical_boundary_candidates !== 1) {
    issues.push('RESULT_CANONICAL_BOUNDARY_COUNT_MISMATCH');
  }
  if (result.boundary_state === 'determined'
    && (result.SolutionSpace !== 'NONEMPTY' || result.Consistency !== 'PASS'
      || result.CompletionDecidable !== 'PASS')) {
    issues.push('RESULT_DETERMINED_REQUIREMENTS_MISMATCH');
  }
  if (result.boundary_state === 'inconsistent'
    && (result.Consistency !== 'FAIL' || result.canonical_boundary_candidates !== 0)) {
    issues.push('RESULT_INCONSISTENT_REQUIREMENTS_MISMATCH');
  }
  if (result.PolicyEvaluation === 'NOT_EVALUATED_NO_OPERATOR_PROFILE'
    && result.admission === 'PASS') {
    issues.push('RESULT_ADMISSION_WITHOUT_PROFILE');
  }
  if (result.boundary_state !== 'determined' && result.admission === 'PASS') {
    issues.push('RESULT_ADMISSION_WITHOUT_DETERMINED_BOUNDARY');
  }
  if (result.business_decision !== null || result.execution_authorization !== null) {
    issues.push('RESULT_UNAUTHORIZED_DECISION');
  }
  return issues;
}

export function validateRealGoldSharedFacts(manifest, gold, formal, result, review) {
  const issues = [];
  if (!manifest?.case_id || [gold, formal, result, review].some(item => item?.case_id !== manifest.case_id)) {
    issues.push('REVIEW_MACHINE_CASE_ID_MISMATCH');
  }
  if (!manifest?.source_sha256 || [gold, formal, result, review].some(item => item?.source_sha256 !== manifest.source_sha256)) {
    issues.push('REVIEW_MACHINE_SOURCE_DIGEST_MISMATCH');
  }
  if (!manifest?.evaluation_version || gold?.protocol_version !== manifest.evaluation_version) {
    issues.push('REVIEW_MACHINE_PROTOCOL_VERSION_MISMATCH');
  }
  if (gold?.boundary_state !== result?.boundary_state) issues.push('REVIEW_MACHINE_BOUNDARY_STATE_MISMATCH');
  if (gold?.policy_evaluation !== result?.PolicyEvaluation) issues.push('REVIEW_MACHINE_POLICY_EVALUATION_MISMATCH');
  if (gold?.admission !== result?.admission) issues.push('REVIEW_MACHINE_ADMISSION_MISMATCH');
  if (manifest?.operator_profile === null && result?.PolicyEvaluation !== 'NOT_EVALUATED_NO_OPERATOR_PROFILE') {
    issues.push('REVIEW_POLICY_WITHOUT_OPERATOR_PROFILE');
  }
  return issues;
}
