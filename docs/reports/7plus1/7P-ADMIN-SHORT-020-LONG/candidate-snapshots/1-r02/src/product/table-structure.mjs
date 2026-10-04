import { isDeepStrictEqual } from 'node:util';

export const TABLE_STRUCTURE_INVARIANT = 'INV-TABLE-STRUCTURAL-ACCOUNTABILITY';

// Bounded pipe-table syntax. Column identities are ordinal, never header meanings.
// Existing clause witnesses remain intact; this is an explicit structural overlay.
export function appendTableStructure(text, structure, tree) {
  const points = [...text];
  const span = (start, end) => ({ source_id: 'task', start, end, quote: points.slice(start, end).join('') });
  const lines = []; let start = 0;
  for (let i = 0; i < points.length; i++) if (points[i] === '\n') {
    lines.push({ start, end: i + 1 }); start = i + 1;
  }
  if (start < points.length) lines.push({ start, end: points.length });
  const baseNodes = [...tree.nodes];
  const opaque = structure.source_accountability.clauses.filter(c => c.state === 'DIAGNOSTIC');
  const add = (type, evidence, extra = {}) => {
    const n = { id: `table-syntax-${type.toLowerCase()}-${evidence.start}-${tree.nodes.length}`,
      type, kind: type.toLowerCase(), source_span: evidence, ...extra };
    tree.nodes.push(n); return n;
  };
  const relate = (type, parent, child, evidence, status = 'UNAMBIGUOUS') => {
    tree.structural_edges.push({ id: `table-relation-${tree.structural_edges.length}`, type,
      parent: parent.id, child: child.id, status, source_spans: [parent.source_span, child.source_span], syntax_evidence: evidence });
  };
  const own = (parent, child, evidence, status) => {
    tree.edges.push({ id: `table-ownership-${tree.edges.length}`, parent: parent.id, child: child.id, kind: 'CONTAINS', status });
    relate('contains', parent, child, evidence, status);
  };
  function scan(line) {
    const raw = span(line.start, line.end).quote.replace(/\r?\n$/u, '');
    if (opaque.some(c => line.start < c.evidence.end && line.end > c.evidence.start)) return null;
    if (!raw.includes('|')) return null;
    const chars = [...raw], pipes = []; let escaped = false, ticks = 0, ambiguous = false;
    for (let k = 0; k < chars.length; k++) {
      if (escaped) { escaped = false; continue; }
      if (chars[k] === '\\') { escaped = true; continue; }
      if (chars[k] === '`') {
        let end = k + 1; while (chars[end] === '`') end++;
        const count = end - k; ticks = ticks === count ? 0 : ticks || count; k = end - 1; continue;
      }
      if (chars[k] === '|') { if (ticks) ambiguous = true; else pipes.push(line.start + k); }
    }
    if (!pipes.length) return null;
    const left = line.start + [...raw.match(/^\s*/u)[0]].length;
    const right = line.start + chars.length - [...raw.match(/\s*$/u)[0]].length;
    const leading = pipes[0] === left, trailing = pipes.at(-1) === right - 1;
    const internal = pipes.slice(leading ? 1 : 0, trailing ? -1 : undefined);
    const a = leading ? left + 1 : left, b = trailing ? right - 1 : right;
    const cuts = [a, ...internal.map(p => p + 1)], ends = [...internal, b];
    const cells = cuts.map((a, i) => {
      const rawSpan = span(a, ends[i]); let x = a, y = ends[i];
      while (x < y && /\s/u.test(points[x])) x++;
      while (y > x && /\s/u.test(points[y - 1])) y--;
      return { source_span: rawSpan, content_span: span(x, y), empty: x === y };
    });
    return { ...line, cells, pipes: pipes.map(p => span(p, p + 1)),
      unsupported: ambiguous || ticks !== 0 || escaped || /^\s{4}|^\t/u.test(raw) || /<br\s*\/?\s*>/iu.test(raw),
      separator: cells.length > 0 && cells.every(c => /^:?-{3,}:?$/u.test(c.content_span.quote)),
      separatorLike: cells.some(c => /^:?-{2,}/u.test(c.content_span.quote)),
      leading, trailing };
  }
  const scanned = lines.map(scan), tables = [];
  for (let i = 0; i < lines.length; i++) {
    const first = scanned[i]; if (!first) continue;
    const next = scanned[i + 1];
    // A delimiter row or explicit outer-pipe form identifies a candidate.
    if (!(next?.separatorLike || first.leading && first.trailing)) continue;
    let end = i + 1; while (scanned[end]) end++;
    const rows = scanned.slice(i, end), evidence = span(first.start, rows.at(-1).end);
    const reasons = [];
    if (!rows[1]?.separator) reasons.push('MALFORMED_OR_MISSING_SEPARATOR');
    if (rows.some(r => r.unsupported)) reasons.push('UNSUPPORTED_OR_AMBIGUOUS_CELL_SYNTAX');
    if (rows.some(r => r.cells.length !== first.cells.length)) reasons.push('INCONSISTENT_COLUMN_COUNT');
    // A nonblank unmarked continuation cannot safely become a cell or a row.
    const following = lines[end] && span(lines[end].start, lines[end].end);
    if (following && following.quote.trim() && !/^\s*(?:#{1,6}\s|[-+*]\s|\d+[.)]\s|```|~~~)/u.test(following.quote))
      reasons.push('UNSUPPORTED_UNMARKED_CONTINUATION');
    const status = reasons.length ? 'UNRESOLVED' : 'UNAMBIGUOUS';
    const table = add('TABLE', evidence, { structural_status: status, column_ids: [] }); table.table_id = table.id;
    const owner = baseNodes.filter(n => ['DOCUMENT', 'SECTION', 'LIST_ITEM'].includes(n.type)
      && n.source_span.start <= evidence.start && n.source_span.end >= evidence.end)
      .sort((a, b) => (a.source_span.end - a.source_span.start) - (b.source_span.end - b.source_span.start))[0];
    const syntax = { rule: 'PIPE_ROWS_WITH_SECOND_LINE_DELIMITER', delimiter_span: rows[1] ? span(rows[1].start, rows[1].end) : null,
      row_line_spans: rows.map(r => span(r.start, r.end)), pipe_spans: rows.flatMap(r => r.pipes) };
    own(owner, table, syntax, status);
    tree.syntax_records.push({ kind: 'table_markup', node_id: table.id, evidence: syntax });
    if (reasons.length) {
      tree.diagnostics.push({ code: 'UNRESOLVED_TABLE_STRUCTURE', node_id: table.id, evidence,
        reasons, continuation_evidence: reasons.includes('UNSUPPORTED_UNMARKED_CONTINUATION') ? following : null,
        observed_cell_counts: rows.map(r => r.cells.length), source_preserved: true });
      tables.push({ table_id: table.id, status, evidence }); i = end - 1; continue;
    }
    table.column_ids = first.cells.map((_, k) => `${table.id}:column:${k}`);
    table.columns = table.column_ids.map((column_id, column_index) => ({ column_id, table_id: table.id,
      column_index, delimiter_span: rows[1].cells[column_index].source_span }));
    const headers = [];
    for (const [r, row] of rows.entries()) {
      const rowNode = add('TABLE_ROW', span(row.start, row.end), { table_id: table.id, row_index: r,
        role: r === 0 ? 'HEADER' : r === 1 ? 'DELIMITER' : 'BODY', structural_status: status });
      rowNode.row_id = rowNode.id; own(table, rowNode, syntax, status); relate('row_of', rowNode, table, syntax);
      for (const [k, cell] of row.cells.entries()) {
        const n = add('TABLE_CELL', cell.source_span, { ...cell, table_id: table.id, row_id: rowNode.id,
          column_id: table.column_ids[k], column_index: k, structural_status: status }); n.cell_id = n.id;
        const cellSyntax = { row_span: rowNode.source_span, pipe_spans: row.pipes, delimiter_cell_span: rows[1].cells[k].source_span, column_index: k };
        own(rowNode, n, cellSyntax, status); relate('cell_of_row', n, rowNode, cellSyntax);
        // Column endpoint is an explicit stable identity, with its source delimiter evidence.
        tree.structural_edges.push({ id: `table-relation-${tree.structural_edges.length}`, type: 'cell_in_column',
          parent: n.id, child: n.column_id, status, source_spans: [n.source_span, rows[1].cells[k].source_span], syntax_evidence: cellSyntax });
        if (r === 0) {
          const h = add('COLUMN_HEADER', cell.source_span, { table_id: table.id, row_id: rowNode.id,
            column_id: n.column_id, cell_id: n.id, content_span: cell.content_span });
          own(n, h, cellSyntax, status); headers.push(h);
          tree.structural_edges.push({ id: `table-relation-${tree.structural_edges.length}`, type: 'header_of_column',
            parent: h.id, child: n.column_id, status, source_spans: [h.source_span, rows[1].cells[k].source_span], syntax_evidence: cellSyntax });
        } else if (r > 1) relate('header_applies_to_cell', headers[k], n, cellSyntax);
      }
    }
    tables.push({ table_id: table.id, status, evidence }); i = end - 1;
  }
  tree.table_accountability = { invariant: TABLE_STRUCTURE_INVARIANT, tables,
    limits: 'Single-line pipe tables only. Ambiguous code pipes, malformed delimiters, inconsistent columns and unmarked continuation are unresolved. No header semantics.' };
  return tree;
}

export function validateTableStructuralAccountability(text, structure, tree, baseTree) {
  const expected = appendTableStructure(text, structure, structuredClone(baseTree));
  if (!isDeepStrictEqual(tree, expected)) throw Error(`${TABLE_STRUCTURE_INVARIANT}:STRUCTURE_OR_PROVENANCE_MISMATCH`);
  return { invariant: TABLE_STRUCTURE_INVARIANT, status: 'PASS',
    tables: tree.table_accountability.tables.length,
    unresolved: tree.table_accountability.tables.filter(t => t.status === 'UNRESOLVED').length };
}
