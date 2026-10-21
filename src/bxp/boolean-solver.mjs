import { boundedJson } from './validation.mjs';

function validateExpression(expression, variables, depth = 0) {
  if (depth > 16) throw new TypeError('Boolean expression depth exceeds 16');
  if (typeof expression === 'boolean') return;
  if (!expression || typeof expression !== 'object' || Array.isArray(expression)) {
    throw new TypeError('Invalid Boolean expression');
  }
  const keys = Object.keys(expression);
  if (keys.length !== 1) throw new TypeError('Ambiguous Boolean expression');
  const operator = keys[0];
  const operand = expression[operator];
  if (operator === 'var') {
    if (typeof operand !== 'string' || !variables.has(operand)) throw new TypeError('Undeclared Boolean variable');
    return;
  }
  if (operator === 'not') return validateExpression(operand, variables, depth + 1);
  if (!['all', 'any', 'implies'].includes(operator) || !Array.isArray(operand)
    || operand.length > 64 || (operator === 'implies' && operand.length !== 2)) {
    throw new TypeError('Unsupported Boolean operator or arity');
  }
  for (const child of operand) validateExpression(child, variables, depth + 1);
}

function evaluateExpression(expression, values) {
  if (typeof expression === 'boolean') return expression;
  if ('var' in expression) return values[expression.var];
  if ('not' in expression) return !evaluateExpression(expression.not, values);
  if ('all' in expression) return expression.all.every(child => evaluateExpression(child, values));
  if ('any' in expression) return expression.any.some(child => evaluateExpression(child, values));
  return !evaluateExpression(expression.implies[0], values) || evaluateExpression(expression.implies[1], values);
}

export function validateBooleanConstraints(variables, formulas, {maxVariables=12}={}) {
  if (!Number.isSafeInteger(maxVariables)||maxVariables<1||maxVariables>128)throw new TypeError('Invalid Boolean validation capacity');
  if (!boundedJson({ variables, formulas }) || !Array.isArray(variables) || variables.length > maxVariables
    || variables.some(name => typeof name !== 'string' || !name.length || name.length > 128)
    || new Set(variables).size !== variables.length || !Array.isArray(formulas) || formulas.length > 256) {
    throw new TypeError('Invalid or oversized Boolean problem');
  }
  const ordered = [...variables].sort();
  const declared = new Set(ordered);
  for (const formula of formulas) validateExpression(formula, declared);
  return ordered;
}

export function solveBooleanConstraints(variables, formulas) {
  const ordered = validateBooleanConstraints(variables, formulas);
  for (let mask = 0; mask < 2 ** ordered.length; mask += 1) {
    const values = Object.fromEntries(ordered.map((name, bit) =>
      [name, Boolean(mask & (1 << (ordered.length - bit - 1)))]));
    if (formulas.every(formula => evaluateExpression(formula, values))) {
      return { result: 'satisfiable', witness: values };
    }
  }
  return { result: 'unsatisfiable', witness: null };
}

export function evaluateBooleanAssignment(variables, formula, values, options={}) {
  const ordered = validateBooleanConstraints(variables, [formula], options);
  if (!boundedJson(values) || !values || typeof values !== 'object' || Array.isArray(values)
    || Object.keys(values).length !== ordered.length || ordered.some(name => !Object.hasOwn(values, name) || typeof values[name] !== 'boolean')) {
    throw new TypeError('A complete exact Boolean assignment is required');
  }
  return evaluateExpression(formula, values);
}

export function canonicalBooleanBoundary(variables, formulas) {
  const ordered = validateBooleanConstraints(variables, formulas);
  const pending = [...formulas];
  let nodes = 0;
  while (pending.length) {
    const expression = pending.pop();
    nodes += 1;
    if (nodes * 2 ** ordered.length > 1000000) throw new RangeError('Boolean canonicalization work limit exceeded');
    if (expression && typeof expression === 'object') {
      if ('not' in expression) pending.push(expression.not);
      else if (!('var' in expression)) pending.push(...Object.values(expression)[0]);
    }
  }
  const membership = [];
  let solutionCount = 0;
  for (let mask = 0; mask < 2 ** ordered.length; mask += 1) {
    const values = Object.fromEntries(ordered.map((name, bit) =>
      [name, Boolean(mask & (1 << (ordered.length - bit - 1)))]));
    const admitted = formulas.every(formula => evaluateExpression(formula, values));
    membership.push(admitted ? '1' : '0');
    if (admitted) solutionCount += 1;
  }
  return { format: 'boundx.boolean-solution-space/experimental-v1', variables: ordered,
    valuation_order: 'lexicographic_false_before_true', membership: membership.join(''), solution_count: solutionCount };
}
