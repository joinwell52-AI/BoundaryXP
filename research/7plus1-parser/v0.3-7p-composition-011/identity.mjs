import {createHash} from 'node:crypto';
export const id=(...parts)=>'p1:'+createHash('sha256').update(JSON.stringify(parts)).digest('hex').slice(0,24);
export const uniq=xs=>[...new Set(xs.filter(x=>x!==undefined&&x!==null))];
export const SLOTS=['I','O','A','P','R','V','C','B'];
