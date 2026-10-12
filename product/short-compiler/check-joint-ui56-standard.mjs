import fs from 'node:fs';
let code=fs.readFileSync(new URL('./check-joint-standard.mjs',import.meta.url),'utf8').replaceAll('ui.55','ui.56').replaceAll('final-ui55-replay','final-ui56-replay');
code=code.replace("check('declared duration endpoint '+n+' allowed in abstract interval model',verifyJointWitness(problem,w).valid);","check('declared scalar duration endpoint '+n+' lies in interval',Number(n)>=Number(problem.intervals[0].lower.value)&&Number(n)<=Number(problem.intervals[0].upper.value));");
code=code.replace("check('no business authorization inferred'","check('time-domain joint embedding has valid witnessed points',!!q.witness.metric_schedule?.['interval:0']&&verifyJointWitness(problem,q.witness).valid);check('no business authorization inferred'");
await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
