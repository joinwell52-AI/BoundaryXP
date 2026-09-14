import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

export function initializeDefaultL1(registry) {
  if (existsSync(join(registry.root, `active-${registry.tenant}.json`))) return;
  const reference = registry.importDirectory(fileURLToPath(new URL('../../domain-packs/l1/core-ontology', import.meta.url)));
  registry.activate(reference);
}
