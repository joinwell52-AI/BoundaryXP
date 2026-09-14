import test from 'node:test';
import assert from 'node:assert/strict';
import { employeeTemplate, parseEmployeeCsv, exportEmployeeCsv, matchEmployees } from '../product/employees.mjs';

const input = { schema: 'boundx-employee-directory/v1', employees: [
  { employee_id: 'pm-01', display_name: 'PM-01', aliases: ['小王', 'Xiao Wang'], subject_type: 'agent', job_title: '项目经理', status: 'inactive' },
  { employee_id: 'e102', display_name: '王岚', aliases: ['小王', 'Xiao Wang'], subject_type: 'human', job_title: '自定义岗位', status: 'active' },
] };
test('CSV round-trips quoted aliases, commas, newlines and custom jobs', () => {
  const directory = structuredClone(input);
  directory.employees[0].job_title = '研发,"协调"\r\n岗位';
  assert.deepEqual(parseEmployeeCsv('\ufeff' + exportEmployeeCsv(directory)), directory);
});
test('employee matching retains shared aliases and inactive identities', () => {
  assert.equal(matchEmployees('小王检查报告。', input).length, 2);
  assert.equal(matchEmployees('pm-01 reviews.', input)[0].status, 'inactive');
  assert.equal(matchEmployees('PM-010 reviews.', input).length, 0);
  assert.equal(matchEmployees('ＰＭ-01 reviews.', input).length, 0);
});
test('CSV never silently changes identity to avoid spreadsheet formulas', () => {
  const directory = structuredClone(input);
  directory.employees[0].display_name = '=malicious()';
  assert.throws(() => exportEmployeeCsv(directory), { code: 'CSV_FORMULA' });
  assert.equal(directory.employees[0].display_name, '=malicious()');
});
for (const suffix of ['bad,row\n', 'id,name,not-json,agent,job,active,\n', '"unterminated']) {
  test(`CSV rejects malformed input ${suffix}`, () => assert.throws(() => parseEmployeeCsv(employeeTemplate() + suffix)));
}
