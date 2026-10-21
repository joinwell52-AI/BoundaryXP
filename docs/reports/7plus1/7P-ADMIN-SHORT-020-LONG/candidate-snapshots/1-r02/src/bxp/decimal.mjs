export function decimal(value) {
  const text = String(value);
  const negative = text.startsWith('-');
  const [whole, fraction = ''] = (negative ? text.slice(1) : text).split('.');
  return { coefficient: BigInt(whole + fraction) * (negative ? -1n : 1n), scale: fraction.length };
}

export function decimalText(value) {
  let { coefficient, scale } = decimal(value);
  if (coefficient === 0n) return '0';
  while (scale && coefficient % 10n === 0n) {
    coefficient /= 10n;
    scale -= 1;
  }
  const negative = coefficient < 0n;
  const digits = (negative ? -coefficient : coefficient).toString().padStart(scale + 1, '0');
  return `${negative ? '-' : ''}${scale ? `${digits.slice(0, -scale)}.${digits.slice(-scale)}` : digits}`;
}

export function compareDecimal(left, right) {
  const first = decimal(left);
  const second = decimal(right);
  const scale = Math.max(first.scale, second.scale);
  const difference = first.coefficient * 10n ** BigInt(scale - first.scale)
    - second.coefficient * 10n ** BigInt(scale - second.scale);
  return difference < 0n ? -1 : difference > 0n ? 1 : 0;
}

export function normalizeBound(bound, domain, lower) {
  if (bound == null) return null;
  if (domain === 'real') return { value: decimalText(bound.value), inclusive: bound.inclusive };
  const { coefficient, scale } = decimal(bound.value);
  const divisor = 10n ** BigInt(scale);
  const quotient = coefficient / divisor;
  const remainder = coefficient % divisor;
  let integer = quotient;
  if (lower && remainder > 0n) integer += 1n;
  if (!lower && remainder < 0n) integer -= 1n;
  if (remainder === 0n && !bound.inclusive) integer += lower ? 1n : -1n;
  return { value: integer.toString(), inclusive: true };
}
