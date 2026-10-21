// Exact unit algebra for mathematical expressions, independent of task wording.
import {multiply,rational,stable} from './ir-kernel/values.mjs';
const inverse=x=>{const q=rational(x);if(!q.n)throw Error('DIVISION_BY_ZERO');return String(q.d)+'/'+String(q.n);};
const atomic={
 '1':[{},'1'],count:[{},'1'],'次':[{},'1'],'%':[{},'1/100'],percent:[{},'1/100'],
 second:[{TIME:1},'1'],seconds:[{TIME:1},'1'],s:[{TIME:1},'1'],'秒':[{TIME:1},'1'],
 minute:[{TIME:1},'60'],minutes:[{TIME:1},'60'],min:[{TIME:1},'60'],'分钟':[{TIME:1},'60'],
 hour:[{TIME:1},'3600'],hours:[{TIME:1},'3600'],'小时':[{TIME:1},'3600'],
 ms:[{TIME:1},'1/1000'],millisecond:[{TIME:1},'1/1000'],day:[{TIME:1},'86400'],'天':[{TIME:1},'86400'],
 W:[{POWER:1},'1'],'瓦':[{POWER:1},'1'],kW:[{POWER:1},'1000'],'千瓦':[{POWER:1},'1000'],
 Wh:[{POWER:1,TIME:1},'3600'],kWh:[{POWER:1,TIME:1},'3600000'],'千瓦时':[{POWER:1,TIME:1},'3600000'],
 CNY:[{CURRENCY_CNY:1},'1'],'元':[{CURRENCY_CNY:1},'1'],
 '立方米':[{VOLUME:1},'1'],m3:[{VOLUME:1},'1'],
 GiB:[{MEMORY_BINARY:1},'1073741824'],MiB:[{MEMORY_BINARY:1},'1048576'],KiB:[{MEMORY_BINARY:1},'1024']
};
const combine=(a,b,sign)=>{
 const powers={...a.powers};for(const[k,v]of Object.entries(b.powers)){powers[k]=(powers[k]??0)+sign*v;if(!powers[k])delete powers[k];}
 return {powers,factor:multiply(a.factor,sign===1?b.factor:inverse(b.factor))};
};
export function unitShape(unit){
 const text=unit??'1';if(atomic[text])return {powers:{...atomic[text][0]},factor:atomic[text][1]};
 // Composite units produced internally are parenthesized, preserving division.
 let level=0;
 for(let i=text.length-1;i>=0;i--){const c=text[i];if(c===')')level++;else if(c==='(')level--;else if(!level&&(c==='*'||c==='/'))return combine(unitShape(text.slice(0,i)),unitShape(text.slice(i+1)),c==='*'?1:-1);}
 if(text.startsWith('(')&&text.endsWith(')'))return unitShape(text.slice(1,-1));
 return {powers:{['UNIT:'+text]:1},factor:'1'};
}
export function convertUnit(value,from,to){
 const a=unitShape(from),b=unitShape(to);if(stable(a.powers)!==stable(b.powers))throw Error('MATH_OPERAND_UNIT: '+from+' -> '+to);
 return multiply(value,multiply(a.factor,inverse(b.factor)));
}
export const productUnit=units=>units.map(u=>'('+u+')').join('*');
export const quotientUnit=(a,b)=>'('+a+')/('+b+')';
