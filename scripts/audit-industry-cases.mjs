import { fileURLToPath } from 'node:url';
import { auditIndustryCases } from '../src/product/case-audit.mjs';
import { readBoundedFile } from '../src/product/files.mjs';

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const paths = process.argv.slice(2);
  if (!paths.length) {
    process.stderr.write('Usage: node scripts/audit-industry-cases.mjs <cases.json> [more files]\n');
    process.exitCode = 2;
  } else {
    const reports = paths.map(path => {
      try { return { path, ...auditIndustryCases(readBoundedFile(path)) }; }
      catch (error) { return { path, inventory_passed: false, error: { code: error.code ?? 'CASE_INPUT', message: error.message } }; }
    });
    process.stdout.write(JSON.stringify({ reports, model_runs_verified: 0, gold_review_verified: false }, null, 2) + '\n');
    if (reports.some(report => !report.inventory_passed)) process.exitCode = 1;
  }
}
