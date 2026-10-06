import { compareDecimal, normalizeBound } from './decimal.mjs';

export function intersectValidatedIntervals(items) {
  const groups = new Map();
  for (const item of items) {
    const key = JSON.stringify([item.scope_id, item.subject, item.dimension, item.unit, item.domain ?? 'real']);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  }
  return [...groups].map(([key, group]) => {
    const [scope_id, subject, dimension, unit, domain] = JSON.parse(key);
    let lower = null;
    let upper = null;
    for (const item of group) {
      const nextLower = normalizeBound(item.lower, domain, true);
      const nextUpper = normalizeBound(item.upper, domain, false);
      if (nextLower && (!lower || compareDecimal(nextLower.value, lower.value) > 0
        || (compareDecimal(nextLower.value, lower.value) === 0 && !nextLower.inclusive))) lower = nextLower;
      if (nextUpper && (!upper || compareDecimal(nextUpper.value, upper.value) < 0
        || (compareDecimal(nextUpper.value, upper.value) === 0 && !nextUpper.inclusive))) upper = nextUpper;
    }
    const comparison = lower && upper ? compareDecimal(lower.value, upper.value) : null;
    const empty = comparison !== null && (comparison > 0
      || (comparison === 0 && (!lower.inclusive || !upper.inclusive)));
    return { scope_id, subject, dimension, unit, domain, lower, upper, empty,
      constraint_ids: group.map(item => item.id).sort() };
  });
}
