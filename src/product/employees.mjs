import { IDS, LIMITS, assert, validateProduct, parseProductJson } from './contracts.mjs';

export const CSV_COLUMNS = ['employee_id', 'display_name', 'aliases', 'subject_type', 'job_title', 'status', 'department'];
export function employeeTemplate() { return CSV_COLUMNS.join(',') + '\r\n'; }
export function parseEmployeeCsv(input) {
  assert(Buffer.byteLength(input, 'utf8') <= LIMITS.file, 'INPUT_LIMIT', 'CSV exceeds limit.');
  const text = input.replace(/^\ufeff/, '');
  const records = [];
  let row = [], field = '', quoted = false, closed = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (quoted) {
      if (char === '"' && text[index + 1] === '"') { field += '"'; index += 1; }
      else if (char === '"') { quoted = false; closed = true; }
      else field += char;
      continue;
    }
    assert(!closed || [',', '\r', '\n'].includes(char), 'CSV_SYNTAX', 'Unexpected characters after quoted field.');
    if (char === '"') { assert(!field && !closed, 'CSV_SYNTAX', 'Quote must begin a field.'); quoted = true; }
    else if (char === ',' || char === '\r' || char === '\n') {
      row.push(field); field = ''; closed = false;
      if (char !== ',') { records.push(row); row = []; if (char === '\r' && text[index + 1] === '\n') index += 1; }
    } else field += char;
  }
  assert(!quoted, 'CSV_SYNTAX', 'Unclosed quoted field.');
  if (field || row.length || closed) { row.push(field); records.push(row); }
  assert(JSON.stringify(records.shift()) === JSON.stringify(CSV_COLUMNS), 'CSV_HEADER', 'CSV columns must match the template exactly.');
  assert(records.length <= LIMITS.employees, 'INPUT_LIMIT', 'Too many employee records.');
  const employees = records.map((values, index) => {
    assert(values.length === CSV_COLUMNS.length, 'CSV_ROW', `Row ${index + 2}: incorrect column count.`);
    const employee = Object.fromEntries(CSV_COLUMNS.map((column, columnIndex) => [column, values[columnIndex]]));
    try { employee.aliases = parseProductJson(employee.aliases); }
    catch { assert(false, 'CSV_ALIASES', `Row ${index + 2}, aliases: expected a JSON array.`); }
    if (!employee.department) delete employee.department;
    try { validateProduct(IDS.employee, { schema: 'boundx-employee-directory/v1', employees: [employee] }); }
    catch (error) { error.message = `Row ${index + 2}: ${error.message}`; throw error; }
    return employee;
  });
  return validateProduct(IDS.employee, { schema: 'boundx-employee-directory/v1', employees });
}
export function exportEmployeeCsv(directory) {
  validateProduct(IDS.employee, directory);
  const encode = value => {
    assert(!/^[\s]*[=+@-]/.test(value), 'CSV_FORMULA', 'Unsafe spreadsheet cell; export canonical JSON instead. Identity values are not changed.');
    return '"' + value.replaceAll('"', '""') + '"';
  };
  return employeeTemplate() + directory.employees.map(employee => CSV_COLUMNS.map(column => encode(column === 'aliases' ? JSON.stringify(employee.aliases) : employee[column] ?? '')).join(',')).join('\r\n') + '\r\n';
}
export const normalizeAlias = value => value.trim().replace(/[A-Z]/g, char => char.toLowerCase());
function containsAlias(source, alias) {
  const normalized = normalizeAlias(alias);
  let start = source.indexOf(normalized);
  while (start >= 0) {
    const before = source[start - 1] ?? '';
    const after = source[start + normalized.length] ?? '';
    if ((!/^[a-z0-9]/.test(normalized) || !/[a-z0-9-]/.test(before)) && (!/[a-z0-9]$/.test(normalized) || !/[a-z0-9-]/.test(after))) return true;
    start = source.indexOf(normalized, start + 1);
  }
  return false;
}
export function matchEmployees(text, directory) {
  const source = normalizeAlias(text);
  return directory.employees.filter(employee => [employee.display_name, ...employee.aliases].some(alias => containsAlias(source, alias)));
}
export function hasUniqueEmployeeMention(text, employee, directory) {
  const source = normalizeAlias(text);
  return [employee.display_name, ...employee.aliases].some(alias => {
    if (!containsAlias(source, alias)) return false;
    const matches = matchEmployees(alias, directory);
    return matches.length === 1 && matches[0].employee_id === employee.employee_id;
  });
}
