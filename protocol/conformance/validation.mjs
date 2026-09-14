import { readFileSync } from 'node:fs';
import Ajv2020 from 'ajv/dist/2020.js';

const readSchema = name => JSON.parse(readFileSync(new URL(`../schemas/${name}`, import.meta.url), 'utf8'));
export const taskSchema = readSchema('boundx-task-v1.schema.json');
export const resultSchema = readSchema('boundx-result-v1.schema.json');
export const suiteSchema = readSchema('boundx-calc-conformance-suite-v1.schema.json');
const validator = new Ajv2020({ strict: true, allErrors: false, coerceTypes: false, useDefaults: false, removeAdditional: false });
validator.addSchema(taskSchema);
validator.addSchema(resultSchema);
export const validateTaskSchema = validator.getSchema(taskSchema.$id);
export const validateResultSchema = validator.getSchema(resultSchema.$id);
export const validateSuiteSchema = validator.compile(suiteSchema);

export function boundedJson(value) {
  const pending = [{ value, depth: 0 }];
  let nodes = 0;
  let textLength = 0;
  while (pending.length) {
    const current = pending.pop();
    nodes += 1;
    if (nodes > 100000 || current.depth > 64) return false;
    const item = current.value;
    if (typeof item === 'string') {
      if (!item.isWellFormed()) return false;
      textLength += item.length;
    } else if (typeof item === 'number') {
      if (!Number.isFinite(item)) return false;
    } else if (item !== null && typeof item === 'object') {
      if (!Array.isArray(item) && ![Object.prototype, null].includes(Object.getPrototypeOf(item))) return false;
      for (const [key, child] of Object.entries(item)) {
        if (!key.isWellFormed()) return false;
        textLength += key.length;
        pending.push({ value: child, depth: current.depth + 1 });
        if (pending.length > 100000) return false;
      }
    } else if (item !== null && typeof item !== 'boolean') return false;
    if (textLength > 2000000) return false;
  }
  return Buffer.byteLength(JSON.stringify(value), 'utf8') <= 2000000;
}
