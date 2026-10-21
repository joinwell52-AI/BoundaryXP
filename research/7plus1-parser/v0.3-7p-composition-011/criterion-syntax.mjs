// Local state predicates licensed by an explicit acceptance section. No business names.
export function criterionSyntax(text){
 const source=text.replace(/^\s*(?:[-*+]\s+(?:\[[ xX]\]\s*)?|\d+[.)]\s+)/u,'').trim();
 const markers=[...source.matchAll(/\b(?:passed|clean|unchanged|no regression)\b(?=\s*(?:不退)?[。.!?；;]?$)|不退|不被误伤|保持不变|(?:测试|检查)[^。；\n]*?(?:通过|全绿|绿)/giu)];
 if(!markers.length)return null;
 return {kind:'EXPLICIT_ACCEPTANCE_STATE',source_predicates:markers.map(m=>({text:m[0],offset:m.index,length:m[0].length})),source,semantic_layer:'STATE',execution:false};
}
