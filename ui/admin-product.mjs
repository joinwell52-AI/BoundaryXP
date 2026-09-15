import { packLabel } from './pack-labels.mjs';
if (location.hash !== '#advanced') location.replace('/legacy#settings');
const heading = document.querySelector('h1');
heading.textContent = localStorage.getItem('boundx-language') === 'en' ? 'Advanced settings' : '高级设置';
const back = document.createElement('a');
back.href = '/legacy#settings';
back.textContent = localStorage.getItem('boundx-language') === 'en' ? 'Back to settings' : '返回设置';
heading.before(back);
const element = id => document.getElementById(id);
let prepared = null;
let active = [];
let installedPacks = [];
let revision = 0;
let employeeRevision = 0;
let employeePackage = null;
let employeeImported = false;
const employeeCall = async input => {
  const response = await fetch('/api/employee-directory', { method: 'POST', headers: { 'content-type': 'application/json',
    'x-boundx-token': document.querySelector('meta[name="boundx-token"]').content }, body: JSON.stringify(input) });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error ?? 'Employee request failed');
  return result;
};
function downloadFile(bytes, name, type) {
  const url = URL.createObjectURL(new Blob([bytes], { type }));
  const link = document.createElement('a'); link.href = url; link.download = name; link.click(); URL.revokeObjectURL(url);
}
const call = async (method, args = {}) => {
  const response = await fetch('/api/admin-product', { method: 'POST', headers: { 'content-type': 'application/json',
    'x-boundx-token': document.querySelector('meta[name="boundx-token"]').content }, body: JSON.stringify({ method, arguments: args }) });
  const value = await response.json();
  if (!response.ok) throw new Error(value.error ?? 'Request failed');
  return value;
};
function stale() { revision++; prepared = null; element('status').textContent = '原文或选包已变化；旧结果已过期，请重新准备。 / Stale: prepare again.'; element('report').textContent = ''; element('raw').textContent = ''; }
for (const id of ['source', 'industry', 'directory']) element(id).addEventListener('input', stale);
function action(id, handler) {
  element(id).addEventListener('click', async () => {
    element(id).disabled = true;
    try { await handler(); } catch (error) { element('status').textContent = error.message; }
    finally { element(id).disabled = false; }
  });
}
for (const id of ['employee-csv', 'employee-name', 'employee-version', 'employee-roles', 'industry']) element(id).addEventListener('input', () => {
  employeeRevision++;
  employeePackage = null; employeeImported = false; element('employee-result').textContent = '内容已变化，请重新生成。 / Rebuild after changes.';
});
element('employee-file').addEventListener('change', async () => {
  try {
    const file = element('employee-file').files[0]; if (!file) return;
    if (file.size > 800000) throw new Error('页面文件过大，请使用CLI。 / Use CLI for larger files.');
    element('employee-csv').value = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(await file.arrayBuffer());
    element('employee-csv').dispatchEvent(new Event('input'));
  } catch (error) { element('status').textContent = error.message; }
});
action('employee-template', async () => downloadFile(await fetch('/api/employee-template').then(response => response.text()), 'employees.csv', 'text/csv'));
action('employee-preview', async () => { element('employee-result').textContent = JSON.stringify(await employeeCall({ operation: 'preview', csv: element('employee-csv').value }), null, 2); });
action('employee-build', async () => {
  const requestedRevision = employeeRevision;
  employeePackage = null; employeeImported = false;
  const l1 = active.find(reference => reference.pack_id === 'core-ontology');
  if (!l1) throw new Error('请先启用L1。 / Activate L1 first.');
  const selectedIndustry = installedPacks.find(reference => reference.digest === element('industry').value);
  const l2 = selectedIndustry && Object.fromEntries(Object.entries(selectedIndustry).filter(([key]) => key !== 'layer'));
  const result = await employeeCall({ operation: 'build', csv: element('employee-csv').value, name: element('employee-name').value,
    version: element('employee-version').value, l1, ...(l2 ? { l2 } : {}), roles_json: element('employee-roles').value });
  if (requestedRevision !== employeeRevision) return;
  employeePackage = result;
  const { archive, ...summary } = employeePackage; element('employee-result').textContent = JSON.stringify(summary, null, 2);
});
action('employee-download', () => {
  if (!employeePackage) throw new Error('请先生成ZIP。 / Build first.');
  downloadFile(Uint8Array.from(atob(employeePackage.archive), char => char.charCodeAt(0)), employeePackage.reference.pack_id + '.zip', 'application/zip');
});
action('employee-import', async () => {
  if (!employeePackage) throw new Error('请先生成ZIP。 / Build first.');
  const requestedRevision = employeeRevision;
  const result = await employeeCall({ operation: 'import', archive: employeePackage.archive });
  if (requestedRevision !== employeeRevision) return;
  employeeImported = true; element('employee-result').textContent = JSON.stringify(result, null, 2);
});
action('employee-activate', async () => {
  if (!employeePackage || !employeeImported) throw new Error('请先确认导入。 / Import first.');
  const reference = employeePackage.reference;
  const result = await employeeCall({ operation: 'activate', reference });
  active = result.active; stale();
  element('directory').replaceChildren(new Option('不使用名册 / None', ''), new Option(`${reference.pack_id}@${reference.version}`, reference.digest));
  element('directory').value = reference.digest;
  element('employee-result').textContent = JSON.stringify(result, null, 2);
});
action('industry-activate', async () => {
  const selected = installedPacks.find(reference => reference.layer === 'L2' && reference.digest === element('industry').value);
  const previous = active.find(reference => installedPacks.some(pack => pack.layer === 'L2' && pack.digest === reference.digest));
  if (!selected && !previous) return;
  const reference = selected ? Object.fromEntries(Object.entries(selected).filter(([key]) => key !== 'layer')) : previous;
  const response = await fetch('/api/industry-selection', { method: 'POST', headers: { 'content-type': 'application/json',
    'x-boundx-token': document.querySelector('meta[name="boundx-token"]').content },
    body: JSON.stringify({ operation: selected ? 'activate' : 'deactivate', reference }) });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error ?? 'Industry selection failed');
  active = result.active; stale(); employeeRevision++; employeePackage = null; employeeImported = false;
});
action('prepare', async () => {
  const requestedRevision = revision;
  const selectedIndustry = element('industry').value;
  if (selectedIndustry && !active.some(reference => reference.digest === selectedIndustry)) throw new Error('请先确认切换行业。 / Confirm industry activation first.');
  const selected = active.filter(reference => reference.pack_id === 'core-ontology' || [element('industry').value, element('directory').value].includes(reference.digest));
  const source = element('source').value;
  const info = await fetch('/api/protocol-info').then(response => response.json());
  if (requestedRevision !== revision) return;
  const result = await call('bx_prepare_admin_task', { source: { text: source, language: 'mixed' },
    profile: { id: 'org.boundx.admin', required_elements: info.core_elements }, packs: selected });
  if (requestedRevision !== revision) return;
  prepared = result;
  element('raw').textContent = JSON.stringify(prepared, null, 2);
  element('status').textContent = '已准备；请由兼容Host生成候选。 / Prepared; Host AI must produce the candidate.';
});
action('download', () => {
  if (!prepared) throw new Error('请先准备上下文。 / Prepare first.');
  const url = URL.createObjectURL(new Blob([JSON.stringify(prepared, null, 2)], { type: 'application/json' }));
  const link = document.createElement('a'); link.href = url; link.download = 'boundx-prepare.json'; link.click(); URL.revokeObjectURL(url);
});
action('evaluate', async () => {
  if (!prepared) throw new Error('请重新准备上下文。 / Prepare again.');
  const requestedRevision = revision;
  const rawCandidate = element('candidate').value;
  const candidate = JSON.parse(rawCandidate);
  if (candidate.prepare_id !== prepared.prepare_id) throw new Error('候选不属于当前上下文。 / Candidate belongs to another prepare.');
  const result = await call('bx_evaluate_admin_candidate', { raw_candidate: rawCandidate });
  if (requestedRevision !== revision || rawCandidate !== element('candidate').value) return;
  element('report').textContent = result.report;
  element('raw').textContent = JSON.stringify(result, null, 2);
  element('status').textContent = result.computed ? '已计算，不代表授权。 / Computed, not authorized.' : '尚未计算，请查看诊断。 / Not computed; see diagnostics.';
});
try {
  const info = await call('bx_list_semantic_packs'); active = info.active; installedPacks = info.installed;
  for (const reference of installedPacks) {
    const enabled = active.some(item => item.digest === reference.digest);
    if (reference.layer === 'L1') { if (enabled) element('l1').textContent = `L1: ${reference.pack_id}@${reference.version}`; continue; }
    if (!['L2', 'L3'].includes(reference.layer) || (reference.layer === 'L3' && !enabled)) continue;
    const option = document.createElement('option'); option.value = reference.digest;
    option.textContent = `${packLabel(reference)}${enabled ? ' · 已启用 / active' : ''}`;
    option.title = `${reference.pack_id}@${reference.version}`;
    element(reference.layer === 'L3' ? 'directory' : 'industry').append(option);
  }
} catch (error) { element('status').textContent = error.message; }
