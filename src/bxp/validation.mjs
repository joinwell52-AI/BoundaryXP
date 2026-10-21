import { registeredSchema, registeredValidator } from './schema-registry.mjs';

export const taskSchema = registeredSchema('task');
export const resultSchema = registeredSchema('result');
export const suiteSchema = registeredSchema('suite');
export const validateTaskSchema = registeredValidator('task');
export const validateResultSchema = registeredValidator('result');
export const validateSuiteSchema = registeredValidator('suite');

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
      if (Array.isArray(item)) {
        if (item.length > 100000 || Reflect.ownKeys(item).length !== item.length + 1) return false;
        for (let index = 0; index < item.length; index += 1) if (!Object.hasOwn(item, index)) return false;
      }
      for (const key of Reflect.ownKeys(item)) {
        if (Array.isArray(item) && key === 'length') continue;
        const descriptor = Object.getOwnPropertyDescriptor(item, key);
        if (typeof key !== 'string' || !descriptor.enumerable || !Object.hasOwn(descriptor, 'value')) return false;
      }
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
