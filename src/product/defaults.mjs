import { fileURLToPath } from 'node:url';

export function initializeDefaultL1(registry) {
  if (registry.list().some(reference => reference.layer === 'L1')) return;
  const reference = registry.importDirectory(fileURLToPath(new URL('../../domain-packs/l1/core-ontology', import.meta.url)));
  registry.activate(reference);
}
