// Bounded source syntax recognizers. No execution, semantic interpretation of code,
// corpus identifiers, model scores, or canonical-slot logic.
const symbol='[A-Za-z_$][\\w$]*(?:\\.[A-Za-z_$][\\w$]*)*';
const prefix='^\\s*(?:\\d+[.)]\\s*)?';
const patterns=[
 new RegExp(prefix+'`?('+symbol+')`?\\s*(?:里|中)\\s*(调用)(?:为|改为)?\\s*(.+?)\\s*[。.]?\\s*$','idu'),
 new RegExp(prefix+'in\\s+`?('+symbol+')`?\\s*,\\s*(call)\\s+(.+?)\\s*[.]?\\s*$','idu'),
 new RegExp(prefix+'`?('+symbol+')`?\\s+(?:must|should|shall)\\s+(call)\\s+(.+?)\\s*[.]?\\s*$','idu'),
 new RegExp(prefix+"(replace)\\s+`?("+symbol+")`?'s\\s+call\\s+with\\s+(.+?)\\s*[.]?\\s*$",'idu')
];
export function callInstruction(text){
 for(let i=0;i<patterns.length;i++){const m=patterns[i].exec(text);if(!m)continue;const owner=i===3?2:1,verb=i===3?1:2;return{owner:{text:m[owner],range:m.indices[owner]},verb:{text:m[verb],range:m.indices[verb]},call:{text:m[3],range:m.indices[3]}};}return null;
}
export function callExpression(text){
 let start=0,end=text.length;while(start<end&&/[\s`]/u.test(text[start]))start++;while(end>start&&/[\s`。]/u.test(text[end-1]))end--;if(text[end-1]==='.')end--;
 const m=new RegExp('^('+symbol+')\\s*\\(','u').exec(text.slice(start,end));if(!m)return {error:'NO_CALLEE_OR_OPEN_PAREN'};
 let cursor=start+m[0].length,part=cursor,quote=null,escape=false,depth=1,parts=[],close=-1;
 for(;cursor<end;cursor++){const c=text[cursor];if(escape){escape=false;continue;}if(quote){if(c==='\\')escape=true;else if(c===quote)quote=null;continue;}if(c==='"'||c==="'"){quote=c;continue;}if(c==='(')depth++;if(c===')'&&--depth===0){parts.push([part,cursor]);close=cursor;break;}if(c===','&&depth===1){parts.push([part,cursor]);part=cursor+1;}}
 if(close<0||quote||text.slice(close+1,end).trim())return {error:'UNBALANCED_OR_TRAILING_CALL_SYNTAX'};
 const atom='(?:'+symbol+'|"[^"\\r\\n]*"|\'[^\'\\r\\n]*\'|\\d+(?:\\.\\d+)?)',supported=new RegExp('^'+atom+'(?:\\s*/\\s*'+atom+')*$','u');
 const args=[];for(let [s,e]of parts){while(s<e&&/\s/u.test(text[s]))s++;while(e>s&&/\s/u.test(text[e-1]))e--;if(s===e){if(parts.length===1)continue;return {error:'EMPTY_ARGUMENT'};}const raw=text.slice(s,e);if(!supported.test(raw))return {error:'UNSUPPORTED_ARGUMENT_EXPRESSION',range:[s,e]};args.push({text:raw,range:[s,e],kind:raw.includes('/')?'PATH_COMPOSITION':'LITERAL_OR_IDENTIFIER'});}
 return {callee:{text:m[1],range:[start,start+m[1].length]},arguments:args,range:[start,close+1]};
}
export function declarationInstruction(text){
 if(!/[：:]\s*$/u.test(text)||/不得|禁止|无需|不需要|must not|do not|need not|\bif\b|如果|若/iu.test(text))return null;
 const files=[...text.matchAll(/(?:[A-Za-z0-9_.-]+\/)*[A-Za-z0-9_.-]+\.(?:py|[cm]?js|ts|tsx|java|rs|go|cpp|h)\b/gu)].map(m=>({text:m[0],range:[m.index,m.index+m[0].length]}));if(!files.length)return null;
 const verb=/(新增|添加|定义|加|add|define|create)/idu.exec(text);if(!verb)return null;
 const test=/测试(?:点|用例)?|\btests?\b/iu.test(text),each=/各(?:自)?(?:加|添|新)?|\beach\b/iu.test(text),functionWord=/函数|\bfunction\b/iu.test(text);
 if(!(test&&each||functionWord&&files.length===1))return null;
 const placement=/(?:在|in\b|to\b)/iu.test(text);if(!placement)return null;
 return{kind:test&&each?'DISTRIBUTIVE_TEST_INSERTION':'FUNCTION_DECLARATION',files,verb:{text:verb[0],range:verb.indices[0]},distributive:test&&each,each_count:/一个|\bone\b/iu.test(text)?1:null};
}
export function declaredSymbols(code){
 const rows=[...code.matchAll(/^(\s*)(?:(?:async\s+)?def|(?:export\s+)?(?:async\s+)?function)\s+([A-Za-z_$][\w$]*)\s*\(/gmu)];if(!rows.length)return[];
 const indent=Math.min(...rows.map(m=>m[1].replace(/\r?\n/gu,'').length));return rows.filter(m=>m[1].replace(/\r?\n/gu,'').length===indent).map(m=>({text:m[2],range:[m.index+m[0].lastIndexOf(m[2]),m.index+m[0].lastIndexOf(m[2])+m[2].length]}));
}
