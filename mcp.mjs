#!/usr/bin/env node
import { evaluateBxpTask, parseAndEvaluateBxpTask, parseStrictJson, protocolInfo, taskSchema, resultSchema, suiteSchema, PRODUCT_VERSION, RAW_JSON_BYTE_LIMIT } from './src/bxp/index.mjs';
import { decompositionToolSchema } from './src/legacy/decomposition-schema.ts';
const packageVersion = PRODUCT_VERSION;
import { reviewBoundX, reviewPlanBoundary, boundaryResponseStatus, boundaryDocumentSchema, boundaryPlanSchema, reviewDecomposition } from './src/legacy/index.ts';

const definitions = [
  { name: 'bx_evaluate_task', description: 'BXP 7+1 task object. Local validation and calculation; no extraction certification or execution authority.', inputSchema: taskSchema },
  { name: 'bx_evaluate_task_json', description: 'Raw BXP JSON text with duplicate-key, byte and numeric precision protection. Returns full BXP result including invalid-input results.', inputSchema: { type: 'object', additionalProperties: false, required: ['raw_json'], properties: { raw_json: { type: 'string', maxLength: RAW_JSON_BYTE_LIMIT } } } },
  { name: 'bx_legacy_review_decomposition', description: 'Deprecated legacy interface; not BXP-IR or BXP-CALC. Finite Boolean contract review. See docs/DECOMPOSITION.md: exact-source requirements, task pre/postconditions, dependency IDs, explicit completion expression. At most 12 variables. Observations only; no authorization.', inputSchema: decompositionToolSchema },
  { name: 'bx_legacy_review_task', description: 'Deprecated legacy interface; not BXP-IR or BXP-CALC. Review task source mappings. Returns explicit suggestions for the task authorizer; never changes requirements.', inputSchema: { type: 'object', properties: { document: boundaryDocumentSchema, locale: { type: 'string', enum: ['zh-CN', 'en'] } }, required: ['document'], additionalProperties: false } },
  { name: 'bx_legacy_review_plan', description: 'Deprecated legacy interface; not BXP-IR or BXP-CALC. Compare a plan and child task texts to a host-confirmed baseline. Findings require owner responses; no business decision is made.', inputSchema: { type: 'object', properties: { baseline: boundaryDocumentSchema, plan: boundaryPlanSchema, locale: { type: 'string', enum: ['zh-CN', 'en'] } }, required: ['baseline', 'plan'], additionalProperties: false } },
  { name: 'bx_legacy_check_responses', description: 'Deprecated legacy interface; not BXP-IR or BXP-CALC. Check which findings remain unanswered. Responses must have disposition, reason and references. Responded does not mean resolved.', inputSchema: { type: 'object', properties: { review: { type: 'object' }, replies: { type: 'array', items: { type: 'object' }, maxItems: 2048 } }, required: ['review', 'replies'], additionalProperties: false } },
];
function invoke(name, args) {
  if (name === 'bx_evaluate_task') return evaluateBxpTask(args);
  if (name === 'bx_evaluate_task_json') {
    if (!args || typeof args.raw_json !== 'string' || Object.keys(args).some(key => key !== 'raw_json')) throw new Error('Expected only raw_json text.');
    return parseAndEvaluateBxpTask(args.raw_json);
  }
  if (name === 'bx_legacy_review_decomposition') return reviewDecomposition(args.input);
  if (name === 'bx_legacy_review_task') return reviewBoundX(args.document, { locale: args.locale });
  if (name === 'bx_legacy_review_plan') return reviewPlanBoundary(args.baseline, args.plan, { locale: args.locale });
  if (name === 'bx_legacy_check_responses') return boundaryResponseStatus(args.review, args.replies);
  throw new Error('Unknown tool');
}
const resources = [
  { uri: 'boundx://protocol-info', name: 'BXP protocol info', value: protocolInfo() },
  ...[taskSchema, resultSchema, suiteSchema].map(schema => ({ uri: schema.$id, name: schema.title, value: schema })),
];
const write = value => process.stdout.write(`${JSON.stringify(value)}\n`);
function handle(line) {
  let request;
  try { request = parseStrictJson(line); } catch { write({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Invalid JSON' } }); return; }
  if (!request || typeof request !== 'object' || Array.isArray(request)) { write({ jsonrpc: '2.0', id: null, error: { code: -32600, message: 'Invalid request' } }); return; }
  if (request.id === undefined) return;
  let result;
  if (request.method === 'initialize') result = { protocolVersion: '2024-11-05', capabilities: { tools: {}, resources: {} }, serverInfo: { name: 'boundx', version: packageVersion, title: '界痕 · BoundX' }, instructions: 'BXP 7+1: producers submit boundx-task/v1, BoundX validates and calculates locally, hosts decide clarification and authority. Read protocol-info and exact schema resources. BXP-EXTRACT is reserved. Legacy tools are explicitly deprecated, not BXP. Stateless: no execution, approval, customer persistence, model or network calls.' };
  else if (request.method === 'tools/list') result = { tools: definitions };
  else if (request.method === 'resources/list') result = { resources: resources.map(item => ({ uri: item.uri, name: item.name, mimeType: 'application/json' })) };
  else if (request.method === 'resources/read') {
    const resource = resources.find(item => item.uri === request.params?.uri);
    if (!resource) { write({ jsonrpc: '2.0', id: request.id, error: { code: -32602, message: 'Unknown resource' } }); return; }
    result = { contents: [{ uri: resource.uri, mimeType: 'application/json', text: JSON.stringify(resource.value) }] };
  }
  else if (request.method === 'ping') result = {};
  else if (request.method === 'tools/call') {
    try { result = { content: [{ type: 'text', text: JSON.stringify(invoke(request.params?.name, request.params?.arguments ?? {})) }] }; }
    catch (error) { result = { isError: true, content: [{ type: 'text', text: error instanceof Error ? error.message : String(error) }] }; }
  } else { write({ jsonrpc: '2.0', id: request.id, error: { code: -32601, message: 'Method not found' } }); return; }
  write({ jsonrpc: '2.0', id: request.id, result });
}
let buffer = Buffer.alloc(0);
process.stdin.on('data', chunk => {
  buffer = Buffer.concat([buffer, chunk]);
  let index;
  while ((index = buffer.indexOf(10)) >= 0) { const line = buffer.subarray(0, index); buffer = buffer.subarray(index + 1); handle(line); }
  if (buffer.length > RAW_JSON_BYTE_LIMIT) { process.stderr.write('Input exceeds 2 MB\n'); process.exit(1); }
});
process.stdin.on('end', () => { if (buffer.length) handle(buffer); });
