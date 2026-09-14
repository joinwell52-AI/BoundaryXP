#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { parseAndEvaluateBxpTask, evaluateBxpTask, protocolInfo, RAW_JSON_BYTE_LIMIT } from './src/bxp/index.mjs';
import { reviewBoundX, reviewPlanBoundary, boundaryResponseStatus, reviewDecomposition } from './src/legacy/index.ts';

const argv = process.argv.slice(2);
const locale = argv.find(value => value.startsWith('--locale='))?.slice('--locale='.length);
const args = argv.filter(value => !value.startsWith('--locale='));
try {
  let result;
  if (args[0] === 'protocol-info' && args.length === 1) result = protocolInfo();
  else if (args[0] === 'evaluate' && args.length === 2) {
    const chunks = [];
    let size = 0;
    for await (const chunk of createReadStream(args[1])) {
      size += chunk.length;
      if (size > RAW_JSON_BYTE_LIMIT) break;
      chunks.push(chunk);
    }
    result = size > RAW_JSON_BYTE_LIMIT ? evaluateBxpTask(undefined) : parseAndEvaluateBxpTask(Buffer.concat(chunks));
  } else if (args[0] === 'legacy' && args.length === 3) {
    process.stderr.write('Deprecated legacy interface; not BXP-IR or BXP-CALC. No silent conversion.\n');
    const inputText = await readFile(args[2], 'utf8');
    if (Buffer.byteLength(inputText) > RAW_JSON_BYTE_LIMIT) throw new Error('Legacy input exceeds 2 MB');
    const input = JSON.parse(inputText);
    if (args[1] === 'task') result = reviewBoundX(input, { locale });
    else if (args[1] === 'plan') result = reviewPlanBoundary(input.baseline, input.plan, { locale });
    else if (args[1] === 'decomposition') result = reviewDecomposition(input);
    else if (args[1] === 'responses') result = boundaryResponseStatus(input.review, input.replies);
    else throw new Error('Unknown legacy command');
  } else throw new Error('Usage: bx evaluate <task.json> | bx protocol-info | bx legacy task|plan|decomposition|responses <legacy.json>');
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
} catch (error) {
  process.stderr.write((error instanceof Error ? error.message : String(error)) + '\n');
  process.exitCode = 1;
}
