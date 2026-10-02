export const cases=[
 {id:'REF_LINE',text:'依据 `src/ledger.py:128` 核查 `input.csv`。',references:['src/ledger.py:128'],locator:'SOURCE_LINE'},
 {id:'REF_SECTION',text:'依据 ADR-0099 §appendix 校验 input.csv。',references:['ADR-0099 §appendix'],locator:'SOURCE_SECTION'},
 {id:'REF_BARE_NEGATIVE',text:'input.csv 位于资料目录。',references:[]},
 {id:'RECIPIENT_ZH',text:'报告接收者：OMEGA',recipient:'OMEGA'},
 {id:'RECIPIENT_EN',text:'report recipient: DELTA',recipient:'DELTA'},
 {id:'RECIPIENT_UNSTATED',text:'报告接收者：未知',recipient:null,unresolved:true},
 {id:'RECIPIENT_BACKGROUND',text:'# 背景\n报告接收者：OMEGA',recipient:null},
 {id:'RECIPIENT_FILENAME',text:'生成 REPORT-ALPHA-to-OMEGA.md。',recipient:null}
];
