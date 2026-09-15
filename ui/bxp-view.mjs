import { translate } from './i18n.mjs';

export function renderThreeLayerReport(host, report, copySource, evaluation, locale) {
  const document = host.ownerDocument;
  const node = (tag, text, source = false) => { const value = document.createElement(tag); if(locale && text && !source)locale.bind(value,language=>translate(text,language));else value.textContent = text; return value; };
  host.replaceChildren();
  let section = host, details = null, layerNumber = '', slot = null, entryCount = 0, technical = null, mappingSection = null;
  for (const line of report.split('\n')) {
    if (!line.trim()) continue;
    const layer = line.match(/^- \*\*【(Layer [123]：.+)】\*\*$/);
    if (layer) {
      section = node('section', ''); section.className = 'report-layer';
      layerNumber = layer[1][6];
      if(layerNumber==='2')mappingSection=section;
      section.append(node('h3', '【'+layer[1]+'】')); host.append(section); details = null; slot = null;
      if(layerNumber==='1'&&copySource){const copy=node('button','📋 复制原文 / Copy source');copy.type='button';copy.onclick=async()=>{let message;try{await copySource();message='已复制 / Copied';}catch{message='复制失败，请手动复制 / Copy failed';}if(locale)locale.bind(copy,language=>translate(message,language));else copy.textContent=message;};section.append(copy);}
      continue;
    }
    if (line.startsWith('### ')) { host.append(node('h2', line.slice(4))); continue; }
    if (line.startsWith('  > ')) { section.append(node('blockquote', line.slice(4), true)); continue; }
    const bucket = layerNumber==='2' && line.match(/^  - \*\*(.+?)\*\*：(.+)$/);
    if(bucket){slot=node('p','');slot.className='report-slot';slot.append(node('strong',bucket[1]+'：'));entryCount=0;details=null;
      if(bucket[2].startsWith('原文未提供'))slot.append(node('span','原文未提供 / Not provided'));
      else if(bucket[2].startsWith('尚未明确'))slot.append(node('span','尚未明确 / Unresolved；'));
      section.append(slot);continue;
    }
    if(layerNumber==='2'&&slot&&line.startsWith('    - ')){slot.append(node('span',(entryCount++?'；':'')+line.slice(6),true));continue;}
    if(layerNumber==='3'){
      const axes=line.match(/validation=([^；]+)；completeness=([^；]+)；consistency=(.+)$/);
      if(axes){const labels={valid:'结构复核通过',invalid:'结构复核未通过',complete:'信息完整',incomplete:'信息不完整',consistent:'已提交约束未发现冲突',inconsistent:'已提交约束存在冲突',undetermined:'一致性尚无法确定'};
        const conclusion=node('p','');conclusion.append(node('span',labels[axes[2]]??axes[2]),node('span','；'),node('span',labels[axes[3]]??axes[3]));conclusion.className='report-conclusion';const validation=node('p','');validation.append(node('span',labels[axes[1]]??axes[1]));section.append(conclusion,validation);continue;}
      if(/^\s*- (intervals|target_sets|handoffs|dependencies|logic)：/.test(line)||line.includes('**Diff [BXP.')||line.startsWith('      - ')){
        if(!technical){technical=node('details','');technical.append(node('summary','系统复核与计算详情 / Validation and calculation details'));}
        technical.append(node('p',line.replace(/^\s*- /,'')));continue;
      }
      if(line==='  - **引擎求值**：'||line==='  - **结论与 Diff**：')continue;
    }
    if (line.startsWith('      - ')) {
      if(layerNumber==='2'&&evaluation?.computed&&evaluation.task)continue;
      if (!details) { details = node('details', ''); details.append(node('summary', '证据与解释 / Evidence and interpretation')); section.append(details); }
      details.append(node('p', line.slice(8))); continue;
    }
    details = null;
    const text = line.replace(/^\s*- /, '');
    const paragraph = node('p', '');
    const pieces = text.split(/(\*\*[^*]+\*\*)/g);
    for (const piece of pieces) paragraph.append(node(piece.startsWith('**') && piece.endsWith('**') ? 'strong' : 'span', piece.startsWith('**') && piece.endsWith('**') ? piece.slice(2, -2) : piece));
    section.append(paragraph);
  }
  if(technical)section.append(technical);
  if(mappingSection&&evaluation?.computed&&evaluation.task){
    const trace=node('details','');trace.className='extraction-trace';
    trace.append(node('summary','① 7+1是怎么得到的？ / How was 7+1 extracted?'));
    trace.append(node('p','模型根据原文和已选上下文生成候选；系统核对结构、引文及引用，再组装Core输入。通过复核不证明语义完整。 / Model candidates are checked for structure, evidence and references; validation does not prove semantic completeness.'));
    const provenance=evaluation.task.extensions?.['org.boundx.producer'];
    trace.append(node('p','模型 / Model：'+(provenance?.producer?.model_id??evaluation.model??'unknown')));
    const table=node('table',''),header=node('tr','');
    for(const title of ['槽位 / Slot','原文证据 / Source evidence','模型提取与解释 / Extraction','语义包引用 / Pack references','系统复核 / Validation'])header.append(node('th',title));
    table.append(header);
    for(const [field,bucket] of Object.entries(evaluation.task.elements)){
      for(const entry of bucket.entries.length?bucket.entries:[null]){
        const origin=provenance?.provenance?.find(item=>item.element===field&&item.entry_id===entry?.id);
        const row=node('tr','');
        const evidence=entry?.evidence.map(item=>`${item.source_id??'task'} [${item.start},${item.end})：${item.quote}`).join('\n')??'无条目证据 / No entry evidence';
        const interpretation=entry?[entry.text,origin?.interpretation?'模型解释（非原文）/ Interpretation: '+origin.interpretation:null,origin?.candidate_ids?.length?'备选 / Alternatives: '+origin.candidate_ids.join(', '):null].filter(Boolean).join('\n'):'原文未提供（候选状态）/ Absent in candidate';
        const references=origin?.semantic_refs?.length?origin.semantic_refs.map(reference=>`${reference.scope}/${reference.pack_id}@${reference.version} · ${reference.entry_id}\nSHA-256: ${reference.digest}`).join('\n'):'未引用词条 / No entry reference';
        for(const value of [field+' · '+bucket.status,evidence,interpretation,references,entry?'已通过结构、引文定位与引用检查；语义仍需核对。 / Structural, locator and reference checks passed; semantics require review.':'候选无条目；不是完整性已获证明。 / No candidate entry; completeness is not proven.'])row.append(node('td',value));
        table.append(row);
      }
    }
    trace.append(table);mappingSection.append(trace);
  }
}

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
