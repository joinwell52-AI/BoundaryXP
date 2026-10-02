import {cases as frozen} from './non-gold-declarations.mjs';
const template=frozen[0].text;
export const cases=['37','True','"folder"','root / 37','"left" / "right"'].map((argument,i)=>({id:'STATIC_INCOMPATIBLE_'+i,text:template.replace('gather_names(warm_dir, root / "cold")','gather_names('+argument+')'),expect:{bindings:1,instantiations:0,collections:0}}));
