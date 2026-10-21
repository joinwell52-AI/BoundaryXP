export const cases=[
 {id:'IMPERATIVE_ZH_LIST',text:'1) 整理 `copper.csv`。',expect:'REQUIRED',predicate:'整理'},
 {id:'IMPERATIVE_ZH_PLAIN',text:'核对 `cedar.json`。',expect:'REQUIRED',predicate:'核对'},
 {id:'IMPERATIVE_EN_LIST',text:'- Inspect `pine.json`.',expect:'REQUIRED',predicate:'Inspect'},
 {id:'IMPERATIVE_EN_NUMBER',text:'12. Review `spruce.json`.',expect:'REQUIRED',predicate:'Review'},
 {id:'IMPERATIVE_NARRATION',text:'昨天检查了 `old.json`。',expect:'UNSTATED',predicate:'检查'},
 {id:'IMPERATIVE_SUBJECT',text:'The assistant reviews `past.json`.',expect:'UNSTATED',predicate:'reviews'},
 {id:'IMPERATIVE_QUOTED',text:'他说：“整理 `fir.csv`”。',expect:'NOT_CURRENT_ACTION'},
 {id:'IMPERATIVE_CODE',text:'```python\ninspect("private.json")\n```',expect:'NOT_CURRENT_ACTION'}
];
