/**
 * BX-RADAR-SINGLE-001 v0.2：结构投影参考，不是生产业务模块。
 * 仅消费已有axes；不理解正文，不调用模型，不计算父子关系。
 * 此实现不覆盖生产UI、来源真实性、公式正确性或比较隔离验收。
 */
export const VIEW_SPEC_VERSION = 'bxradar.single/0.2';
export const AXIS_ORDER = Object.freeze(['I', 'O', 'A', 'P', 'R', 'V', 'C', 'B']);
const NAMES = Object.freeze({I:'输入范围',O:'产物交付',A:'动作关系',P:'参与责任',R:'额度时间',V:'版本依据',C:'完成与停止',B:'禁止限制'});
const copy = value => JSON.parse(JSON.stringify(value));
const scalarCompare = (a, b) => {
  const aa = Array.from(a, x => x.codePointAt(0)), bb = Array.from(b, x => x.codePointAt(0));
  for (let i = 0; i < Math.min(aa.length, bb.length); i++) if (aa[i] !== bb[i]) return aa[i] - bb[i];
  return aa.length - bb.length;
};
export function compareClauseIds(a, b) {
  const aa = /^c(\d+)$/.exec(a), bb = /^c(\d+)$/.exec(b);
  if (aa && bb) {
    const na = BigInt(aa[1]), nb = BigInt(bb[1]);
    if (na !== nb) return na < nb ? -1 : 1;
  }
  return scalarCompare(a, b);
}
const rounded = n => { const x = Number(n.toFixed(12)); return Object.is(x, -0) ? 0 : x; };
export function axisPoint(axis) {
  const k = AXIS_ORDER.indexOf(axis);
  if (k < 0) throw new Error(`UNKNOWN_AXIS:${axis}`);
  const theta = -Math.PI / 2 + k * Math.PI / 4;
  return {axis, x:rounded(Math.cos(theta)), y:rounded(Math.sin(theta))};
}

export function projectSingleResult(input) {
  if (!input || input.mode !== 'single') throw new Error('NOT_SINGLE_MODE');
  if (typeof input.task_id !== 'string' || !input.task_id) throw new Error('TASK_ID_REQUIRED');
  if (!Array.isArray(input.clauses)) throw new Error('CLAUSE_LIST_NOT_PROVIDED');
  if (input.math_analysis !== undefined && !Array.isArray(input.math_analysis)) throw new Error('INVALID_MATH_ANALYSIS');
  const seen = new Set();
  for (const c of input.clauses) {
    if (!c || typeof c.id !== 'string' || !c.id) throw new Error('CLAUSE_ID_REQUIRED');
    if (seen.has(c.id)) throw new Error(`DUPLICATE_CLAUSE_ID:${c.id}`);
    if (typeof c.text !== 'string') throw new Error(`CLAUSE_TEXT_REQUIRED:${c.id}`);
    seen.add(c.id);
  }
  const clauses = [], unmapped = [], diagnostics = [];
  const ordered = [...input.clauses].sort((a,b) => compareClauseIds(a.id,b.id));
  for (const raw of ordered) {
    if (!Array.isArray(raw.axes) || raw.axes.length === 0) {
      unmapped.push({...copy(raw), mapping_error:'AXES_MISSING_OR_INVALID'});
      continue;
    }
    const invalid = raw.axes.filter(a => !AXIS_ORDER.includes(a));
    if (invalid.length) {
      // 不能丢掉坏轴后画一个貌似完整的局部轮廓。
      unmapped.push({...copy(raw), mapping_error:'UNKNOWN_AXIS', invalid_axes:copy(invalid)});
      continue;
    }
    const dims = new Set(raw.axes);
    if (dims.size !== raw.axes.length) diagnostics.push({clause_id:raw.id, code:'DUPLICATE_AXIS_IN_VIEW'});
    const axes = AXIS_ORDER.filter(a => dims.has(a));
    const points = axes.map(axisPoint);
    const axis_mask = axes.reduce((m,a) => m | (1 << AXIS_ORDER.indexOf(a)), 0);
    const primitive = points.length === 1 ? 'point' : points.length === 2 ? 'segment' : 'polygon';
    clauses.push({...copy(raw), axes, source_axes:copy(raw.axes), axis_mask,
      geometry:{primitive, points, closed:primitive === 'polygon', filled:primitive === 'polygon'}});
  }
  const grouped = new Map();
  for (const c of clauses) {
    if (!grouped.has(c.axis_mask)) grouped.set(c.axis_mask, {
      axis_mask:c.axis_mask, axes:copy(c.axes), clause_ids:[], geometry:copy(c.geometry)
    });
    grouped.get(c.axis_mask).clause_ids.push(c.id);
  }
  const groups = [...grouped.values()].sort((a,b) => a.axis_mask-b.axis_mask);
  const axes = AXIS_ORDER.map(a => ({
    id:a, title:NAMES[a], ...axisPoint(a),
    clause_ids:clauses.filter(c => c.axes.includes(a)).map(c => c.id),
    count:clauses.filter(c => c.axes.includes(a)).length
  }));
  return {
    view_spec_version:VIEW_SPEC_VERSION, mode:'single', task_id:input.task_id,
    result_ref:copy(input.result_ref ?? {}), source_ref:copy(input.source_ref ?? {}),
    content_availability:input.clauses.length === 0 ? 'EMPTY_LIST' : unmapped.length ? 'HAS_UNMAPPED' : 'MAPPED',
    clause_count:input.clauses.length, mapped_clause_count:clauses.length,
    unmapped_clause_count:unmapped.length, association_total:axes.reduce((n,a) => n+a.count,0),
    axes, clauses, groups, unmapped, diagnostics,
    math_analysis:copy(input.math_analysis ?? []), issues:copy(input.issues ?? []),
    record_status:copy(input.record_status ?? {})
  };
}
