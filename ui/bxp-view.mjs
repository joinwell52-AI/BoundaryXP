const states = {
  resolved: '已明确 / Resolved',
  unresolved: '存在歧义：请明确解释、主体或范围。 / Unresolved: clarify interpretation, actor or scope.',
  absent: '未提供：请补充依据或明确缺失项；不会自动填充。 / Absent: supply evidence or clarify the omission; no default is inferred.',
};
export function renderBxpResult(host, task, result, info) {
  const document = host.ownerDocument;
  const element = (tag, text) => { const node = document.createElement(tag); if (text !== undefined) node.textContent = text; return node; };
  const json = (parent, title, value) => { parent.append(element('h3', title), element('pre', JSON.stringify(value, null, 2))); };
  host.replaceChildren(element('h2', '02 / 检查结果 · Evaluation'));
  const axes = element('div'); axes.className = 'axes';
  for (const [key, value] of Object.entries(result.evaluation)) axes.append(element('p', `${key}: ${value}`));
  host.append(axes, element('p', '三轴独立；complete 或 consistent 不代表获准执行。 / Independent axes; complete or consistent is not permission to execute.'));
  if (result.evaluation.validation === 'valid') {
    const buckets = element('section'); buckets.append(element('h3', '八桶三态 · Eight explicit buckets'));
    for (const key of info.core_elements) {
      const bucket = task.elements[key], row = element('article'); row.dataset.element = key; row.dataset.state = bucket.status;
      row.append(element('h3', `${key} · ${states[bucket.status]}`));
      for (const entry of bucket.entries) row.append(element('p', `${entry.id} · ${entry.kind}: ${entry.text}`));
      buckets.append(row);
    }
    host.append(buckets);
    json(host, 'Profile / 应用要求', result.applied_profile);
    json(host, 'Resolved elements / 已明确项', result.resolved_elements);
    json(host, 'Deficit / 缺项', result.deficit);
    json(host, 'Scopes / 显式作用域（未声明时使用协议 task 作用域）', task.scopes ?? []);
    const evidence = element('section'); evidence.append(element('h3', '全部证据 · All evidence (Unicode code points [start,end))'));
    const visit = (value, path) => {
      if (!value || typeof value !== 'object') return;
      if (typeof value.quote === 'string' && Number.isInteger(value.start) && Number.isInteger(value.end)) {
        evidence.append(element('p', `${path} · source_id=${value.source_id ?? 'task'} · [${value.start},${value.end})`), element('blockquote', value.quote));
      }
      for (const [key, child] of Object.entries(value)) if (child && typeof child === 'object') visit(child, `${path}.${key}`);
    };
    visit(task, 'task'); host.append(evidence);
    json(host, 'Sources / 原始来源与摘要', {source: task.source, sources: task.sources ?? []});
  } else host.append(element('p', '输入无效，不展示为已验证的任务。请核对原始 JSON、Schema、证据、版本及精度。 / Invalid input is not a validated task. Check raw JSON, schema, evidence, version and numeric precision.'));
  for (const [kind, calculation] of Object.entries(result.calculations)) json(host, `Calculation / 计算 · ${kind}`, calculation);
  json(host, 'Findings / 发现', result.findings);
  json(host, 'Authority / 非授权结果', {business_decision: result.business_decision, execution_authorization: result.execution_authorization});
  const details = element('details'); details.append(element('summary', '完整原始结果 / Full result'), element('pre', JSON.stringify(result, null, 2))); host.append(details);
}
