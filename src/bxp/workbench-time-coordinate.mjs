// Lexical time coordinates and exact unit conversion, without task semantics.
import {add,multiply,units,dimension} from './ir-kernel/values.mjs';
const fail=code=>{const error=new Error(code);error.code=code;throw error;};
export function readInstant(value){
 if(typeof value!=='string')return null;
 // Full calendar date and an explicit offset are required. No local-machine zone.
 let m=value.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日北京时间(\d{1,2}):(\d{2})(?::(\d{2}))?$/u),parts,offset;
 if(m){parts=m.slice(1).map(x=>Number(x??0));offset=480;}
 else{
  m=value.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?(Z|[+-]\d{2}:\d{2})$/u);if(!m)return null;
  parts=m.slice(1,7).map(x=>Number(x??0));const zone=m[7];
  if(zone==='Z')offset=0;else{const h=Number(zone.slice(1,3)),n=Number(zone.slice(4));if(h>14||n>59||h===14&&n)return null;offset=(zone[0]==='-'?-1:1)*(h*60+n);}
 }
 const [year,month,day,hour,minute,second]=parts;
 if(year<1||month<1||month>12||day<1||day>31||hour>23||minute>59||second>59)return null;
 const local=new Date(0);local.setUTCFullYear(year,month-1,day);local.setUTCHours(hour,minute,second,0);
 if(local.getUTCFullYear()!==year||local.getUTCMonth()!==month-1||local.getUTCDate()!==day)return null;
 const seconds=String(local.getTime()/1000-offset*60),originSeconds=String(local.getTime()/1000-hour*3600-minute*60-second-offset*60);
 const date=[String(year).padStart(4,'0'),String(month).padStart(2,'0'),String(day).padStart(2,'0')].join('-');
 return {seconds,origin_seconds:originSeconds,date,utc_offset_minutes:offset,label:value};
}
export function isInstantQuantity(c){
 return c?.type==='quantity'&&['lower','upper'].some(k=>c[k])&&['lower','upper'].every(k=>c[k]===null||c[k]&&typeof c[k].inclusive==='boolean'&&readInstant(c[k].value));
}
export function convertTime(value,from,to){
 if(!Object.hasOwn(units,from)||!Object.hasOwn(units,to)||dimension(from)!=='TIME'||dimension(to)!=='TIME')fail('MATH_TIME_UNIT_INVALID');
 const inverse=units[to].includes('/')?units[to].split('/').reverse().join('/'):'1/'+units[to];
 return multiply(multiply(value,units[from]),inverse);
}
export function timeCoordinate(value,origin,unit){
 const point=readInstant(value);if(!point)fail('MATH_TIME_POINT_INVALID');
 return convertTime(add(point.seconds,multiply(origin.origin_seconds,'-1')),'second',unit);
}
export function instantConstraintValue(c){
 if(c?.type==='domain'&&c.mode==='SELECT'&&c.values?.length===1&&readInstant(c.values[0]))return c.values[0];
 if(c?.type==='quantity'&&c.role==='VALUE'&&isInstantQuantity(c)&&c.lower?.value===c.upper?.value&&c.lower.inclusive&&c.upper.inclusive)return c.lower.value;
 return null;
}
export function instantTarget(c,unit){
 if(!isInstantQuantity(c))fail('MATH_TIME_TARGET_INVALID');
 const origin=readInstant((c.upper??c.lower).value);
 return {origin,target:{...c,unit,lower:c.lower?{...c.lower,value:timeCoordinate(c.lower.value,origin,unit)}:null,upper:c.upper?{...c.upper,value:timeCoordinate(c.upper.value,origin,unit)}:null}};
}
