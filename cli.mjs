#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { reviewBoundX, reviewPlanBoundary, boundaryResponseStatus, reviewDecomposition } from './src/index.ts';

const argv = process.argv.slice(2);
const [command, inputFile] = argv.filter(x => !x.startsWith('--locale='));
const locale = argv.find(x => x.startsWith('--locale='))?.slice('--locale='.length);
try {
  if (!inputFile) throw new Error('Usage: node cli.mjs task|plan|decomposition|responses input.json');
  const text = await readFile(inputFile, 'utf8');
  if (Buffer.byteLength(text) > 2_000_000) throw new Error('Input exceeds 2 MB');
  const input = JSON.parse(text);
  let result;
  if (command === 'decomposition') result = reviewDecomposition(input);
  else if (command === 'task') result = reviewBoundX(input, { locale });
  else if (command === 'plan') result = reviewPlanBoundary(input.baseline, input.plan, { locale });
  else if (command === 'responses') result = boundaryResponseStatus(input.review, input.replies);
  else throw new Error('Unknown command');
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
}
