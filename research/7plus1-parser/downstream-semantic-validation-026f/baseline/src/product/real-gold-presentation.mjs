const slots = ['I', 'O', 'A', 'P', 'R', 'V', 'C', 'B'];
const gates = Array.from({ length: 10 }, (_, index) => `G${index + 1}`);
const formalKeys = ['E', 'Sigma', 'Q', 'F', 'K', 'Relations', 'D', 'Phi'];

function slotRows(markdown, language) {
  const rows = new Map();
  const lines = markdown.split(/\r?\n/u);
  for (let index = 0; index < lines.length; index += 1) {
    const heading = lines[index].match(/^### \[([IOAPRVBC])\]/u);
    if (!heading) continue;
    const fields = [];
    for (let next = index + 1; next < lines.length && !/^#{2,3} /u.test(lines[next]); next += 1) fields.push(lines[next]);
    const status = fields.find(line => line.startsWith('- Status: '))?.match(/`([^`]+)`/u)?.[1] ?? null;
    const evidence = fields.find(line => line.startsWith('- Evidence: '))?.slice('- Evidence: '.length).trim() ?? null;
    const valueLabel = language === 'zh-CN' ? '- 审定值: ' : '- Adjudicated value: ';
    const value = fields.find(line => line.startsWith(valueLabel))?.slice(valueLabel.length) ?? null;
    rows.set(heading[1], { status, value, evidence: evidence ? evidence.split(/,\s*/u) : [] });
  }
  return rows;
}

function formalExpressions(markdown) {
  const section = markdown.split(/^## 4\./mu)[1]?.split(/^## 5\./mu)[0];
  return section === undefined ? null : [...section.matchAll(/\$\$([\s\S]*?)\$\$/gu)].map(match => match[1].trim());
}

export function calculationExpressions(markdown) {
  const section = markdown.split(/^## 5\./mu)[1]?.split(/^## 6\./mu)[0];
  if (section === undefined) return null;
  const sections = section.split(/^### (\d+)\.[^\r\n]*\r?$/gmu);
  const groups = [];
  for (let index = 1; index <= 9; index += 1) {
    if (sections[index * 2 - 1] !== String(index)) return null;
    const formulas = [...sections[index * 2].matchAll(/\$\$([\s\S]*?)\$\$/gu)].map(item => item[1].trim());
    if (!formulas.length) return null;
    groups.push(formulas);
  }
  return groups;
}

export function calculationFormulaDifferences(markdowns) {
  const chinese = calculationExpressions(markdowns['zh-CN'] ?? '');
  const english = calculationExpressions(markdowns.en ?? '');
  if (!chinese || !english) return [{ section: null, formula_index: null,
    zh: chinese === null ? null : 'present', en: english === null ? null : 'present' }];
  const differences = [];
  for (let section = 0; section < 9; section += 1) {
    const count = Math.max(chinese[section].length, english[section].length);
    for (let formulaIndex = 0; formulaIndex < count; formulaIndex += 1) {
      const zh = chinese[section][formulaIndex] ?? null;
      const en = english[section][formulaIndex] ?? null;
      if (zh !== en) {
        const chinesePoints = [...(zh ?? '')];
        const englishPoints = [...(en ?? '')];
        const offset = chinesePoints.findIndex((point, index) => point !== englishPoints[index]);
        const firstDifference = offset < 0 ? chinesePoints.length : offset;
        differences.push({ section: section + 1, formula_index: formulaIndex + 1, zh, en,
          first_differing_codepoint: firstDifference,
          zh_character: chinesePoints[firstDifference] ?? null,
          en_character: englishPoints[firstDifference] ?? null });
      }
    }
  }
  return differences;
}

export function calculationExplanations(markdown) {
  const section = markdown.split(/^## 5\./mu)[1]?.split(/^## 6\./mu)[0];
  if (section === undefined) return Array.from({ length: 9 }, () => []);
  const sections = section.split(/^### (\d+)\.[^\r\n]*\r?$/gmu);
  return Array.from({ length: 9 }, (_, position) => {
    const index = position + 1;
    const body = sections[index * 2];
    if (sections[index * 2 - 1] !== String(index) || typeof body !== 'string') return [];
    const lastFormula = body.lastIndexOf('$$');
    const explanation = lastFormula < 0 ? '' : body.slice(lastFormula + 2).trim();
    return explanation.split(/\r?\n/u).map(line => line.trim())
      .filter(line => line && !/^(?:\||#{1,6}\s|---)/u.test(line)
        && !/^(?:\*\*)?(?:结果|Result)\s*[:：]/iu.test(line));
  });
}

export function calculationExplanationGaps(markdown) {
  return calculationExplanations(markdown).flatMap((lines, position) => lines.length ? [] : [position + 1]);
}

function decodedFormalExpression(expression) {
  const wrapped = expression.match(/^\\texttt\{([\s\S]*)\}$/u);
  if (!wrapped) return null;
  return wrapped[1].replaceAll('\\textbackslash\\{\\}', '\\')
    .replaceAll('\\textasciicircum\\{\\}', '^').replaceAll('\\textasciitilde\\{\\}', '~')
    .replace(/\\([{}_$%#&])/gu, '$1');
}

export function validateRealGoldPresentation(markdowns, manifest, gold, evidence, formal, result, review) {
  const issues = [];
  for (const language of ['zh-CN', 'en']) {
    const markdown = markdowns[language];
    if (typeof markdown !== 'string') { issues.push(`PRESENTATION_MISSING:${language}`); continue; }
    const displayedStatus = markdown.match(language === 'zh-CN'
      ? /^- 状态: `([^`]+)`/mu : /^- Status: `([^`]+)`/mu)?.[1] ?? null;
    const displayedSource = markdown.match(language === 'zh-CN'
      ? /^- 原始文件: `([^`]+)`/mu : /^- Source file: `([^`]+)`/mu)?.[1] ?? null;
    if (!markdown.includes(`- Case ID: \`${manifest.case_id}\``)
      || !markdown.includes(`- SHA-256: \`${manifest.source_sha256}\``)
      || displayedSource !== manifest.source_file
      || !manifest.source_task_id || !displayedSource.includes(manifest.source_task_id)
      || displayedStatus !== review.final_status) issues.push(`PRESENTATION_IDENTITY_MISMATCH:${language}`);
    const indexed = [...markdown.matchAll(/^\|\s*(E\d+)\s*\|\s*\[(\d+),\s*(\d+)\)\s*\|\s*SOURCE\s*\|/gmu)]
      .map(match => [match[1], Number(match[2]), Number(match[3])]);
    const expected = (evidence.evidence ?? []).map(item => [item.evidence_id, item.start, item.end]);
    if (JSON.stringify(indexed) !== JSON.stringify(expected)) issues.push(`PRESENTATION_EVIDENCE_INDEX_MISMATCH:${language}`);
    const rows = slotRows(markdown, language);
    for (const slot of slots) {
      const row = rows.get(slot);
      const machine = gold.slots?.[slot];
      if (!row || !machine || row.status !== machine.status
        || JSON.stringify(row.evidence) !== JSON.stringify(machine.evidence)) {
        issues.push(`PRESENTATION_SLOT_MISMATCH:${language}:${slot}`);
      }
      const expectedValue = machine?.[language === 'zh-CN' ? 'value_zh' : 'value_en'];
      if (typeof expectedValue === 'string' && row?.value !== expectedValue) {
        issues.push(`PRESENTATION_SLOT_VALUE_MISMATCH:${language}:${slot}`);
      }
    }
    const field = name => markdown.match(new RegExp(`${name}=\\\\text\\{([^}]+)\\}`, 'u'))?.[1]?.replaceAll('\\_', '_') ?? null;
    if (field('BoundaryState') !== result.boundary_state
      || field('PolicyEvaluation') !== result.PolicyEvaluation
      || field('Admission') !== result.admission) issues.push(`PRESENTATION_RESULT_MISMATCH:${language}`);
    for (const gate of gates) {
      const shown = markdown.match(new RegExp(`^\\| ${gate} \\| (PASS|FAIL|PENDING) \\|`, 'mu'))?.[1] ?? null;
      if (shown !== review.gates?.[gate]?.status) issues.push(`PRESENTATION_GATE_MISMATCH:${language}:${gate}`);
    }
  }
  const chinese = formalExpressions(markdowns['zh-CN'] ?? '');
  const english = formalExpressions(markdowns.en ?? '');
  if (!chinese?.length || JSON.stringify(chinese) !== JSON.stringify(english)) issues.push('PRESENTATION_FORMAL_MODEL_MISMATCH');
  const chineseCalculations = calculationExpressions(markdowns['zh-CN'] ?? '');
  const englishCalculations = calculationExpressions(markdowns.en ?? '');
  if (!chineseCalculations || JSON.stringify(chineseCalculations) !== JSON.stringify(englishCalculations)) {
    issues.push('PRESENTATION_CALCULATION_FORMULA_MISMATCH');
  }
  if (['Missing_task', 'ForbiddenConflict'].some(name => Array.isArray(result?.[name]) && result[name].some(value =>
    typeof value === 'string' && /[\p{Script=Han}；]/u.test(value)))) {
    issues.push('PRESENTATION_CALCULATION_NON_NEUTRAL_TERM');
  }
  if (chineseCalculations) {
    const textResult = index => chineseCalculations[index].at(-1).match(/=\\text\{([\s\S]*)\}$/u)?.[1]
      ?.replace(/\\([{}_$%#&])/gu, '$1');
    const resultFormula = (name, value) => `${name}=\\text{${typeof value === 'string' ? value.replaceAll('_', '\\_') : ''}}`;
    const expectedList = name => Array.isArray(result?.[name])
      ? result[name].length ? [result[name].join('；'), result[name].join('; ')] : ['empty'] : [];
    const uniqueness = chineseCalculations[5][1]?.match(/^canonical\\_boundary\\_candidates=(\d+),\\quad BoundaryUnique=(true|false)$/u);
    const cardinality = chineseCalculations[5][2]?.match(/^\|\\Omega_B\|=\\text\{([^}]*)\}$/u)?.[1]?.replaceAll('\\_', '_');
    if (!expectedList('Missing_task').includes(textResult(0))
      || !expectedList('ForbiddenConflict').includes(textResult(1))
      || textResult(2) !== result?.Consistency
      || textResult(3) !== result?.CompletionDecidable
      || textResult(4) !== result?.SolutionSpace
      || Number(uniqueness?.[1]) !== result?.canonical_boundary_candidates
      || (uniqueness?.[2] === 'true') !== result?.BoundaryUnique
      || cardinality !== result?.legal_execution_paths_cardinality
      || chineseCalculations[6].length !== 1
      || chineseCalculations[6][0] !== `\\boxed{${resultFormula('BoundaryState', result?.boundary_state)}}`
      || chineseCalculations[7].length !== 1
      || chineseCalculations[7][0] !== resultFormula('PolicyEvaluation', result?.PolicyEvaluation)
      || chineseCalculations[8].length !== 1
      || chineseCalculations[8][0] !== resultFormula('Admission', result?.admission)) {
      issues.push('PRESENTATION_CALCULATION_RESULT_MISMATCH');
    }
  }
  const validFormal = formalKeys.every(key => Array.isArray(formal?.[key])
    && formal[key].every(value => typeof value === 'string' && value.length > 0));
  const expected = validFormal ? formalKeys.flatMap(key => formal[key]) : null;
  const displayed = chinese?.filter(expression => expression.startsWith('\\texttt{'))
    .map(decodedFormalExpression) ?? [];
  if (!validFormal || JSON.stringify(displayed) !== JSON.stringify(expected)) {
    issues.push('PRESENTATION_FORMAL_MACHINE_MISMATCH');
  }
  return issues;
}
