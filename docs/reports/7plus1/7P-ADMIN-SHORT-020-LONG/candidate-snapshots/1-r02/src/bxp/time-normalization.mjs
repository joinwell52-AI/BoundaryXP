import { decimal, decimalText } from './decimal.mjs';

const factors = new Map([
  ['second', [1n, 0]], ['seconds', [1n, 0]], ['s', [1n, 0]],
  ['millisecond', [1n, 3]], ['milliseconds', [1n, 3]], ['ms', [1n, 3]],
  ['minute', [60n, 0]], ['minutes', [60n, 0]],
  ['hour', [3600n, 0]], ['hours', [3600n, 0]],
  ['day', [86400n, 0]], ['days', [86400n, 0]],
]);

function scaleBound(bound, multiplier, extraScale) {
  if (bound === null) return null;
  const value = decimal(bound.value);
  const coefficient = value.coefficient * multiplier;
  const scale = value.scale + extraScale;
  const negative = coefficient < 0n;
  const digits = (negative ? -coefficient : coefficient).toString().padStart(scale + 1, '0');
  const text = `${negative ? '-' : ''}${scale ? `${digits.slice(0, -scale)}.${digits.slice(-scale)}` : digits}`;
  return { value: decimalText(text), inclusive: bound.inclusive };
}

export function normalizeValidatedTimeIntervals(intervals) {
  const diagnostics = [];
  const mappings = [];
  const normalized = intervals.map(interval => {
    if (!['time', 'duration'].includes(interval.dimension)) return structuredClone(interval);
    const factor = factors.get(interval.unit);
    if (!factor || (interval.domain === 'integer' && (factor[0] !== 1n || factor[1] !== 0))) {
      diagnostics.push({ constraint_id: interval.id, code: factor ? 'INTEGER_TIME_LATTICE_UNSUPPORTED' : 'TIME_UNIT_UNSUPPORTED' });
      return structuredClone(interval);
    }
    const output = { ...structuredClone(interval), unit: 'second',
      lower: scaleBound(interval.lower, ...factor), upper: scaleBound(interval.upper, ...factor) };
    mappings.push({ constraint_id: interval.id, source_unit: interval.unit, target_unit: 'second',
      factor: { coefficient: factor[0].toString(), decimal_scale: factor[1] } });
    return output;
  });
  return { profile: 'boundx-time-normalization/experimental-v1', intervals: normalized, mappings, diagnostics };
}
