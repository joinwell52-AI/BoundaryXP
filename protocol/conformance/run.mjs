import { readFileSync } from 'node:fs';
import { isDeepStrictEqual } from 'node:util';
import { evaluateTask } from './evaluate.mjs';
import { validateSuiteSchema, validateTaskSchema, validateResultSchema } from './validation.mjs';

const suite = JSON.parse(readFileSync(new URL('./bxp-calc-v1.0.json', import.meta.url), 'utf8'));
const failures = [];
if (!validateSuiteSchema(suite)) throw new Error(JSON.stringify(validateSuiteSchema.errors));

for (const item of suite.cases) {
  const actual = evaluateTask(item.task);
  if (!validateResultSchema(actual)
      || Boolean(validateTaskSchema(item.task)) !== (item.schema_expectation === 'valid')
      || !isDeepStrictEqual(actual, item.expected_result)) {
    failures.push({
      id: item.id,
      expected: item.expected_result,
      actual,
    });
  }
  if (actual.business_decision !== null || actual.execution_authorization !== null) {
    failures.push({ id: item.id, error: 'authority boundary changed' });
  }
}

if (failures.length) {
  process.stderr.write(`${JSON.stringify({ suite: suite.suite_version, failures }, null, 2)}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(`${JSON.stringify({
    suite: suite.suite,
    suite_version: suite.suite_version,
    protocol_version: suite.protocol_version,
    cases: suite.cases.length,
    passed: suite.cases.length,
    historical_source_count: suite.historical_source_count,
    foundational_case_count: suite.foundational_case_count,
    business_decision: null,
    execution_authorization: null,
  }, null, 2)}\n`);
}
