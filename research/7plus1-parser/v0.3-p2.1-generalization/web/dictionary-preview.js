const element = (tag, text, className) => {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
};

// Split by Unicode code points, including both dictionary hits and evidence spans.
// Overlapping aliases keep all candidates; the preview never resolves an identity.
export function previewSegments(text, scan, evidenceSpan = null) {
  const chars = [...text], matches = scan?.matches ?? [];
  const valid = span => Array.isArray(span) && span.length === 2
    && span.every(Number.isSafeInteger) && span[0] >= 0
    && span[1] > span[0] && span[1] <= chars.length;
  const ranges = matches.filter(match => valid(match.span));
  const evidence = valid(evidenceSpan) ? evidenceSpan : null;
  const points = [...new Set([0, chars.length, ...ranges.flatMap(match => match.span), ...(evidence ?? [])])].sort((a, b) => a - b);
  return points.slice(0, -1).map((start, index) => {
    const end = points[index + 1];
    const hits = ranges.filter(match => match.span[0] <= start && match.span[1] >= end);
    return {
      text: chars.slice(start, end).join(''),
      refs: [...new Set(hits.flatMap(match => match.entry_refs))],
      terms: [...new Set(hits.map(match => match.text))],
      evidence: Boolean(evidence && start >= evidence[0] && end <= evidence[1]),
    };
  });
}

const fieldNames = {
  id: '条目编号', employee_id: '员工编号', display_name: '姓名', name: '名称',
  aliases: '花名／别称', label: '名称', surface: '内部称呼', canonical: '标准名称',
  meaning: '含义', definition: '定义', description: '说明', terms: '词语',
  employment: '任职情况', employment_facts: '任职记录', status: '状态',
  current_position: '当前岗位', current_department: '当前部门',
  position: '岗位', position_id: '岗位编号', department: '部门',
  department_id: '部门编号', holder: '任职人', holder_employee_id: '任职员工编号',
  current_holder: '当前任职人', current_holder_employee_id: '当前任职员工编号',
  title: '职务', valid_from: '生效日期', effective_date: '生效日期',
  job_title: '当前职务', position_ref: '岗位条目', department_ref: '部门条目',
  personnel_note: '任职说明', semantic_dimensions: '涉及维度', environment_class: '环境类别',
  facts: '事实', notes: '说明', scope: '适用范围', components: '组成',
  required_components: '必要组成', historical_positions: '历史岗位',
  history: '历史记录', employment_status: '任职情况', left_on: '离职日期',
  start_date: '开始日期', end_date: '结束日期', joined_on: '入职日期',
  transferred_on: '转岗日期', interpretation: '解释', kind: '类型',
  mapsTo: '对应概念', domain: '领域', environment: '环境', identifiers: '标识',
  not_implied: '不包含的含义', does_not_imply: '不包含的含义',
};
const scalar = value => value === null ? '未指定' : typeof value === 'boolean' ? (value ? '是' : '否') : String(value);
function appendValue(target, value) {
  if (Array.isArray(value)) {
    const list = element('ul');
    for (const item of value) { const li = element('li'); appendValue(li, item); list.append(li); }
    target.append(list);
  } else if (value && typeof value === 'object') {
    const list = element('dl', undefined, 'dictionary-fields');
    for (const [key, item] of Object.entries(value)) {
      const content = element('dd'); appendValue(content, item);
      list.append(element('dt', fieldNames[key] ?? key), content);
    }
    target.append(list);
  } else target.append(document.createTextNode(scalar(value)));
}

export function openDictionaryPreview({ nodes, initialNodeId, dictionaries = {}, api, evidenceSpans = [] }) {
  if (!nodes?.length) return;
  const opener = document.activeElement;
  const dialog = element('dialog', undefined, 'dictionary-dialog');
  dialog.setAttribute('aria-labelledby', 'dictionary-preview-title');
  const header = element('div', undefined, 'proof-dialog-head');
  const title = element('h2', '原文与语义词预览'); title.id = 'dictionary-preview-title';
  const close = element('button', '关闭 ×', 'btn'); close.type = 'button'; close.onclick = () => dialog.close();
  header.append(title, close);
  const controls = element('div', undefined, 'dictionary-preview-controls');
  const select = element('select'); select.setAttribute('aria-label', '预览任务');
  for (const node of nodes) select.add(new Option(node.label, node.id));
  select.value = nodes.some(node => node.id === initialNodeId) ? initialNodeId : nodes[0].id;
  controls.append(select, element('p', '点击下划线词查看词义；同词的多个候选会一并列出。', 'dictionary-preview-hint'));
  const evidenceSelect = element('select'); evidenceSelect.setAttribute('aria-label', '原文证据片段');
  evidenceSpans.forEach((span, index) => evidenceSelect.add(new Option('来源 ' + (index + 1), String(index))));
  if (evidenceSpans.length > 1) controls.append(evidenceSelect);
  const status = element('p', '', 'dictionary-preview-status'); status.setAttribute('role', 'status');
  const layout = element('div', undefined, 'dictionary-preview-layout');
  const source = element('div', undefined, 'dictionary-preview-source'); source.tabIndex = 0;
  source.setAttribute('aria-label', '完整原文及语义词');
  const details = element('section', undefined, 'dictionary-preview-details');
  details.setAttribute('aria-label', '所选词语的语义库候选'); details.setAttribute('aria-live', 'polite');
  layout.append(source, details); dialog.append(header, controls, status, layout);
  let sequence = 0;
  const show = async () => {
    const request = ++sequence, node = nodes.find(row => row.id === select.value);
    const span = node.id === initialNodeId ? evidenceSpans[Number(evidenceSelect.value) || 0] : null;
    source.replaceChildren(); details.replaceChildren(element('p', '选择原文中带下划线的词语。', 'dictionary-preview-hint'));
    const render = scan => {
      source.replaceChildren();
      for (const part of previewSegments(node.text, scan, span)) {
        let text;
        if (part.refs.length) {
          text = element('button', part.text, 'dictionary-hit'); text.type = 'button';
          text.title = part.terms.join('、') + '：点击查看词义';
          text.setAttribute('aria-label', part.text + '：查看 ' + part.refs.length + ' 个语义库候选');
          text.onclick = () => {
            source.querySelectorAll('.dictionary-hit[aria-pressed]').forEach(hit => hit.removeAttribute('aria-pressed'));
            text.setAttribute('aria-pressed', 'true');
            details.replaceChildren(element('h3', part.terms.join(' / ')));
            if (part.refs.length > 1) details.append(element('p', '命中 ' + part.refs.length + ' 个候选，需结合任务上下文确定。', 'dictionary-preview-hint'));
            for (const ref of part.refs) {
              const entry = scan.entries[ref]; if (!entry) continue;
              const card = element('article', undefined, 'dictionary-entry');
              card.append(element('p', entry.layer + ' · ' + (entry.pack_label ?? entry.pack_id), 'dictionary-entry-layer'));
              appendValue(card, entry.value);
              const provenance = element('details');
              provenance.append(element('summary', '查看词条来源'), element('p', entry.path + entry.pointer));
              card.append(provenance); details.append(card);
            }
          };
        } else text = document.createTextNode(part.text);
        if (part.evidence) { const mark = element('mark'); mark.append(text); source.append(mark); }
        else source.append(text);
      }
    };
    render(null);
    status.textContent = '正在读取语义词…';
    const saved = node.result?.dictionaries;
    const selected = saved?.packs ? Object.fromEntries(saved.packs.map(pack => [pack.layer.toLowerCase(), pack.id])) : dictionaries;
    try {
      const scan = await api('/api/dictionaries/preview', {
        text: node.text, dictionaries: selected,
        ...(saved?.sha256 ? { selection_sha256: saved.sha256 } : {}),
      });
      if (request !== sequence || !dialog.isConnected) return;
      render(scan);
      const labels = scan.packs.map(pack => pack.layer + ' · ' + pack.label).join('；');
      status.textContent = `${scan.matches.length} 处命中 · ${scan.entries.length} 个词条${labels ? ' · ' + labels : ' · 未启用字典'}`;
      if (!scan.matches.length) details.replaceChildren(element('p', '当前原文没有命中所选字典的词语。', 'dictionary-preview-hint'));
      if (span) source.querySelector('mark')?.scrollIntoView({ block: 'center' });
    } catch (error) {
      if (request !== sequence || !dialog.isConnected) return;
      status.textContent = error.message === 'DICTIONARY_PREVIEW_VERSION_MISMATCH'
        ? '这份记录使用的字典内容已更新，暂不能显示当时的词义；完整原文仍可查看。'
        : '语义词暂未加载：' + error.message;
      const retry = element('button', '重新读取语义词', 'btn'); retry.type = 'button'; retry.onclick = show;
      details.replaceChildren(retry);
    }
  };
  select.onchange = show;
  evidenceSelect.onchange = show;
  dialog.addEventListener('close', () => { ++sequence; dialog.remove(); if (opener?.isConnected) opener.focus(); }, { once: true });
  document.body.append(dialog); dialog.showModal(); show();
  return dialog;
}
