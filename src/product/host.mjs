import { fileURLToPath } from 'node:url';
import { PackRegistry } from './registry.mjs';
import { ProducerService } from './producer.mjs';
import { evaluateCandidate, renderThreeLayers } from './assembler.mjs';
import Ajv2020 from 'ajv/dist/2020.js';
import { assert, parseProductJson, packReference, prepareSchema } from './contracts.mjs';
import { initializeDefaultL1 } from './defaults.mjs';

export function createProductHost(options = {}) {
  const registry = new PackRegistry(options.root ?? process.env.BOUNDX_DATA_DIR ?? fileURLToPath(new URL('../../.boundx', import.meta.url)),
    options.tenant ?? process.env.BOUNDX_TENANT ?? 'local');
  if (options.initializeDefaults !== false) initializeDefaultL1(registry);
  const service = new ProducerService(registry, { allowDirectoryDisclosure: options.allowDirectoryDisclosure ?? process.env.BOUNDX_ALLOW_L3_DISCLOSURE === '1' });
  return { registry, service,
    invoke(name, input = {}) {
      input = parseProductJson(JSON.stringify(input));
      assert(inputValidators.get(name)?.(input), 'PRODUCT_INPUT', 'Unknown operation or invalid product tool arguments.');
      if (name === 'bx_list_semantic_packs') return { installed: registry.list(), active: registry.active() };
      if (name === 'bx_get_semantic_pack_info') { const pack = registry.load(input.reference); return { descriptor: pack.descriptor, digest: pack.digest }; }
      if (name === 'bx_prepare_admin_task') return service.prepare(input);
      if (name === 'bx_evaluate_admin_candidate') {
        const evaluation = evaluateCandidate(service, input.candidate, { historical: input.historical === true });
        let source = '';
        try { source = service.load(input.candidate?.prepare_id).source.text; } catch {}
        return { ...evaluation, report: renderThreeLayers(source, evaluation) };
      }
      throw new Error('Unknown product operation.');
    } };
}
const reference = packReference;
export const productTools = [
  { name: 'bx_list_semantic_packs', description: 'List installed/active local packs. Import and activation do not authorize execution.', inputSchema: { type: 'object', additionalProperties: false, properties: {} } },
  { name: 'bx_get_semantic_pack_info', description: 'Read a locked package descriptor, not private employee payloads.', inputSchema: { type: 'object', additionalProperties: false, required: ['reference'], properties: { reference } } },
  { name: 'bx_prepare_admin_task', description: 'Prepare exact task text and explicitly active packs for Host AI. No model call. L3 disclosure is controlled by Host configuration, never candidate data.',
    inputSchema: prepareSchema },
  { name: 'bx_evaluate_admin_candidate', description: 'Validate candidate against its saved prepare; assemble and calculate only through the existing BXP Core. Returns three-layer report; no execution authority.',
    inputSchema: { type: 'object', additionalProperties: false, required: ['candidate'], properties: { candidate: { type: 'object' }, historical: { type: 'boolean' } } } },
];
const validator = new Ajv2020({ strict: false, validateFormats: false });
const inputValidators = new Map(productTools.map(tool => [tool.name, validator.compile(tool.inputSchema)]));
