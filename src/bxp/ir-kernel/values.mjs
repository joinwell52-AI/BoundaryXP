import {fail} from './diagnostics.mjs';
const gcd=(a,b)=>b?gcd(b,a%b):a<0n?-a:a;
export function rational(value){
 if(typeof value==='number'&&(!Number.isFinite(value)||Number.isInteger(value)&&!Number.isSafeInteger(value)))fail('NUMERIC_PRECISION_LOSS',null,null,'LOAD');
 const s=String(value);if(s.length>4096)fail('NUMERIC_CAPACITY',null,null,'RESOURCE');
 let n,d;
 if(/^-?\d+\/\d+$/.test(s)){[n,d]=s.split('/').map(BigInt);}
 else{const m=s.match(/^(-?)(\d+)(?:\.(\d+))?(?:e([+-]?\d+))?$/i);if(!m)fail('EXACT_NUMBER_REQUIRED');const e=Number(m[4]??0)-(m[3]?.length??0);if(Math.abs(e)>4096)fail('NUMERIC_CAPACITY',null,null,'RESOURCE');n=BigInt(m[1]+m[2]+(m[3]??''));d=1n;if(e>=0)n*=10n**BigInt(e);else d=10n**BigInt(-e);}
 if(!d)fail('ZERO_DENOMINATOR');const g=gcd(n,d);return {n:n/g,d:d/g};
}
export const exact=x=>{const q=rational(x);return q.d===1n?String(q.n):q.n+'/'+q.d;};
export const add=(a,b)=>{const x=rational(a),y=rational(b);return exact((x.n*y.d+y.n*x.d)+'/'+(x.d*y.d));};
export const multiply=(a,b)=>{const x=rational(a),y=rational(b);return exact(x.n*y.n+'/'+(x.d*y.d));};
export const compare=(a,b)=>{const x=rational(a),y=rational(b),d=x.n*y.d-y.n*x.d;return d<0n?-1:d>0n?1:0;};
export const units={second:'1',seconds:'1',s:'1',minute:'60',minutes:'60',min:'60',hour:'3600',hours:'3600',ms:'1/1000',millisecond:'1/1000',milliseconds:'1/1000',day:'86400',days:'86400','秒':'1','分钟':'60','小时':'3600','毫秒':'1/1000',count:'1','次':'1'};
export const dimension=u=>u==null||['count','次'].includes(u)?'SCALAR':Object.hasOwn(units,u)?'TIME':fail('UNKNOWN_UNIT',null,null,'TYPE',{unit:u});
export const toBase=(v,u)=>multiply(v,u==null?'1':units[u]??fail('UNKNOWN_UNIT'));
export const UNKNOWN=Object.freeze({unknown:true});
export const unknown=x=>x?.unknown===true;
export const and=xs=>xs.includes(false)?false:xs.some(unknown)?UNKNOWN:true;
export const or=xs=>xs.includes(true)?true:xs.some(unknown)?UNKNOWN:false;
export const not=x=>unknown(x)?UNKNOWN:!x;
export function stable(x){if(Array.isArray(x))return '['+x.map(stable).join(',')+']';if(x&&typeof x==='object')return '{'+Object.keys(x).sort().map(k=>JSON.stringify(k)+':'+stable(x[k])).join(',')+'}';return JSON.stringify(x);}
export const identity=x=>typeof x==='object'?stable(x):typeof x+':'+x;
export const unique=xs=>[...new Map(xs.map(x=>[identity(x),x])).values()];
