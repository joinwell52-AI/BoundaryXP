#!/usr/bin/env node
import { decompositionToolSchema } from './src/decomposition-schema.ts';
import { readFileSync } from 'node:fs';
const packageVersion = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')).version;
import { reviewBoundX, reviewPlanBoundary, boundaryResponseStatus, boundaryDocumentSchema, boundaryPlanSchema, reviewDecomposition } from './src/index.ts';

// Stateless transport. The host owns mounting, identity, authority and evidence persistence.
const definitions = [
  { name: 'bx_review_decomposition', description: 'Finite Boolean contract review. See docs/DECOMPOSITION.md: exact-source requirements, task pre/postconditions, dependency IDs, explicit completion expression. At most 12 variables. Observations only; no authorization.', inputSchema: decompositionToolSchema },
  { name: 'bx_review_task', description: 'Review task source mappings. Returns explicit suggestions for the task authorizer; never changes requirements.', inputSchema: { type: 'object', properties: { document: boundaryDocumentSchema, locale: { type: 'string', enum: ['zh-CN', 'en'] } }, required: ['document'], additionalProperties: false } },
  { name: 'bx_review_plan', description: 'Compare a plan and child task texts to a host-confirmed baseline. Findings require owner responses; no business decision is made.', inputSchema: { type: 'object', properties: { baseline: boundaryDocumentSchema, plan: boundaryPlanSchema, locale: { type: 'string', enum: ['zh-CN', 'en'] } }, required: ['baseline', 'plan'], additionalProperties: false } },
  { name: 'bx_check_responses', description: 'Check which findings remain unanswered. Responses must have disposition, reason and references. Responded does not mean resolved.', inputSchema: { type: 'object', properties: { review: { type: 'object' }, replies: { type: 'array', items: { type: 'object' }, maxItems: 2048 } }, required: ['review', 'replies'], additionalProperties: false } },
];
function invoke(name, args) {
  if (name === 'bx_review_decomposition') return reviewDecomposition(args.input);
  if (name === 'bx_review_task') return reviewBoundX(args.document, { locale: args.locale });
  if (name === 'bx_review_plan') return reviewPlanBoundary(args.baseline, args.plan, { locale: args.locale });
  if (name === 'bx_check_responses') return boundaryResponseStatus(args.review, args.replies);
  throw new Error('Unknown tool');
}
const write = value => process.stdout.write(`${JSON.stringify(value)}\n`);
function handle(line) {
  let request;
  try { request = JSON.parse(line); } catch { write({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Invalid JSON' } }); return; }
  if (!request || typeof request !== 'object' || Array.isArray(request)) { write({ jsonrpc: '2.0', id: null, error: { code: -32600, message: 'Invalid request' } }); return; }
  if (request.id === undefined) return;
  let result;
  if (request.method === 'initialize') result = { protocolVersion: '2024-11-05', capabilities: { tools: {} }, serverInfo: { name: 'boundx', version: packageVersion, title: '界痕 · BoundX' }, instructions: 'Read README for the document schema. Seven parameters I/O/A/P/R/V/C must quote source text; omit unknown mappings. Each finding requires a task-owner response. This server is stateless: host must verify baseline authority, persist input/output and deliver reminders. No response or suggestion authorizes work.' };
  else if (request.method === 'tools/list') result = { tools: definitions };
  else if (request.method === 'ping') result = {};
  else if (request.method === 'tools/call') {
    try { result = { content: [{ type: 'text', text: JSON.stringify(invoke(request.params?.name, request.params?.arguments ?? {})) }] }; }
    catch (error) { result = { isError: true, content: [{ type: 'text', text: error instanceof Error ? error.message : String(error) }] }; }
  } else { write({ jsonrpc: '2.0', id: request.id, error: { code: -32601, message: 'Method not found' } }); return; }
  write({ jsonrpc: '2.0', id: request.id, result });
}
let buffer = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => {
  buffer += chunk;
  if (Buffer.byteLength(buffer) > 2_000_000) { process.stderr.write('Input exceeds 2 MB\n'); process.exit(1); }
  let index;
  while ((index = buffer.indexOf('\n')) >= 0) { const line = buffer.slice(0, index); buffer = buffer.slice(index + 1); handle(line); }
});
