import fs from'node:fs';const p='research/7plus1-parser/v0.3-7p-repair-007/export.mjs';fs.writeFileSync(p,fs.readFileSync(p,'utf8').replaceAll('7p-repair-006','7p-repair-007'));
