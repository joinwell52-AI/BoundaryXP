import fs from 'node:fs';import path from 'node:path';import {spawnSync} from 'node:child_process';
const env={...process.env,BOUNDARY_WORK:path.resolve('.boundx/products/0.1.0-candidate.031-r1.2-ui.60')};const r=spawnSync(process.execPath,['product/short-compiler/check-scope-selftests.mjs','frozen-ui60'],{env,stdio:'inherit',windowsHide:true});process.exitCode=r.status;
