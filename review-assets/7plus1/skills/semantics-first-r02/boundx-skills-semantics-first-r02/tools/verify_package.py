#!/usr/bin/env python3
"""Offline package validation only. No model, network, runtime, or deployment calls."""
from __future__ import annotations
import hashlib
import itertools
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXCLUDED = {'PACKAGE-MANIFEST.json', 'VALIDATION.json', 'SHA256SUMS.txt'}

def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()

def read_json(rel: str):
    return json.loads((ROOT / rel).read_text(encoding='utf-8'))

def run() -> dict:
    checks = []
    def check(name: str, condition: bool, detail):
        checks.append({'id': name, 'pass': bool(condition), 'detail': detail})
    manifest = read_json('PACKAGE-MANIFEST.json')
    paths = [x['path'] for x in manifest['files']]
    actual = sorted(p.relative_to(ROOT).as_posix() for p in ROOT.rglob('*')
                    if p.is_file() and p.relative_to(ROOT).as_posix() not in EXCLUDED)
    check('closed_package_inventory', sorted(paths) == actual and len(paths) == len(set(paths)),
          {'listed': len(paths), 'actual': len(actual)})
    bad_hashes=[];bad_encoding=[]
    for row in manifest['files']:
        relative=Path(row['path'])
        if relative.is_absolute() or '..' in relative.parts:
            bad_hashes.append(row['path']);continue
        data=(ROOT/relative).read_bytes()
        if digest(data)!=row['sha256'] or len(data)!=row['bytes']:
            bad_hashes.append(row['path'])
        try:
            text=data.decode('utf-8')
            if data.startswith(b'\xef\xbb\xbf') or b'\r' in data or not data.endswith(b'\n'):
                bad_encoding.append(row['path'])
        except UnicodeDecodeError:
            bad_encoding.append(row['path'])
    check('payload_digests', not bad_hashes, {'mismatches':bad_hashes})
    check('utf8_no_bom_lf', not bad_encoding, {'mismatches':bad_encoding})
    files=manifest['instruction_editions']
    texts={language:{role:(ROOT/path).read_text(encoding='utf-8') for role,path in rolemap.items()}
           for language,rolemap in files.items()}
    markers_ok=True
    for language,roles in texts.items():
        for role,text in roles.items():
            markers_ok &= text.startswith('---\n') and f'name: boundx-semantic-{role}\n' in text
            markers_ok &= '接口版本：candidate-ir/1.2' in text and 'semantics-first-r02' in text
            markers_ok &= 'description:' in text.split('---',2)[1]
    check('frontmatter_and_version_markers', markers_ok, {'editions':len(files),'roles_per_edition':2})
    selected=manifest['default_model_instruction_files']
    check('single_default_instruction_profile',
          len(selected)==2 and selected==list(files['zh-CN'].values())
          and sum(1 for p in paths if p.endswith('/SKILL.md'))==2
          and all(p.endswith('SKILL.en.md') for p in files['en'].values()),
          {'default':selected,'english_is_alternative':True})
    m=read_json('docs/PARITY-MAP.json');missing=[]
    for role,key in [('parse','parse_sections'),('audit','audit_sections')]:
        for zh,en in m[key]:
            if '## '+zh not in texts['zh-CN'][role]:missing.append(zh)
            if '## '+en not in texts['en'][role]:missing.append(en)
    for lang in texts:
        alltext='\n'.join(texts[lang].values())
        for token in m['language_cues']:
            if token not in alltext:missing.append(lang+':'+token)
    check('document_alignment_anchors', not missing,
          {'missing':missing,'not_a_semantic_translation_proof':True})
    forbidden=['MANUAL-TEST-001','app.yaml','env.json','dev.md','ops.md','summary.md',
               'evaluation/language/expected.json','T=16','SAT:16']
    leaks=[{'language':lang,'role':role,'token':token} for lang,roles in texts.items()
           for role,text in roles.items() for token in forbidden if token in text]
    check('no_known_001_answers_in_skills', not leaks,
          {'matches':leaks,'scope':'literal scan for named standard answers only; not a proof of absence of every possible leakage'})
    sources=read_json('evaluation/language/sources.json')
    pair_index=read_json('evaluation/language/pairs.json')
    expect=read_json('evaluation/language/expected.json')
    byid={x['id']:x for x in sources['cases']};errors=[]
    for x in sources['cases']:
        if len(x['text'])!=x['codepoints'] or digest(x['text'].encode('utf-8'))!=x['sha256_utf8']:
            errors.append(x['id']+':text')
        data=(ROOT/'evaluation/language'/x['file']).read_bytes()
        if data!=(x['text']+'\n').encode('utf-8') or digest(data)!=x['sha256_utf8_with_final_LF']:
            errors.append(x['id']+':file')
    check('source_text_integrity', not errors and len(byid)==54 and len(sources['cases'])==54,
          {'errors':errors,'paired_texts':48,'mixed_texts':6})
    errors=[];seen=[]
    for pair in pair_index['pairs']:
        members=[byid[x] for x in pair['source_ids']]
        if sorted(x['language'] for x in members)!=['en','zh-CN']:errors.append(pair['pair_id']+':languages')
        for x in members:
            seen.append(x['id'])
            if x['pair_id']!=pair['pair_id']:errors.append(x['id']+':pair')
            for token in pair['protected_tokens']:
                if token not in x['text']:errors.append(x['id']+':'+token)
    for exp in expect['cases']:
        if 'source_id' in exp:
            for token in exp.get('protected_tokens',[]):
                if token not in byid[exp['source_id']]['text']:errors.append(exp['source_id']+':'+token)
        for lang,a in exp.get('evidence_anchors',{}).items():
            text=byid[exp['pair_id']+'-'+lang]['text'];start,end=a['codepoint_span']
            if text[start:end]!=a['quote']:errors.append(exp['pair_id']+':anchor')
    check('pairing_identifiers_and_evidence', not errors and len(pair_index['pairs'])==24 and len(set(seen))==48,
          {'errors':errors,'not_live_cross_language_acceptance':True})
    exp_pair={x['pair_id'] for x in expect['cases'] if 'pair_id'in x}
    exp_mixed={x['source_id'] for x in expect['cases'] if 'source_id'in x}
    status_ok=(exp_pair=={x['pair_id'] for x in pair_index['pairs']}
               and exp_mixed=={x['id'] for x in sources['cases'] if x['language']=='mixed'}
               and expect['model_input_allowed'] is False
               and expect['not_boundx_native_schema'] is True
               and sources['live_model_validation']=='NOT_RUN'
               and all(x['live_model_validation']=='NOT_RUN' for x in expect['cases']))
    check('evaluation_separation_and_status',status_ok,{'expectations':len(expect['cases']),'model_calls':0})
    p=read_json('docs/r01-provenance.json')
    unchanged=all(digest((ROOT/'evaluation/legacy-r01'/n).read_bytes())==h
                  for n,h in p['unchanged_legacy_evaluation_sha256'].items())
    check('legacy_r01_data_preserved',unchanged,{'files':2,'source_cases':20})
    # Logic checks verify reference distinctions, not text parsing or product code.
    rows=list(itertools.product([False,True],repeat=2))
    necessary=[(a,g) for a,g in rows if (not a or g)]
    trigger=[(a,g) for a,g in rows if (not g or a)]
    not_both=[(a,b) for a,b in rows if not(a and b)]
    neither=[(a,b) for a,b in rows if not a and not b]
    logic={'necessary_and_trigger_differ':necessary!=trigger,
           'not_both_three_models':len(not_both)==3,
           'neither_one_model':len(neither)==1,
           'open_closed_interval_endpoints':not(0<0<=18) and 0<18<=18,
           'shared_three_minus_qa_one':[(d,1) for d in range(4) if d+1<=3]==[(0,1),(1,1),(2,1)]}
    check('limited_reference_logic',all(logic.values()),logic)
    return {'kind':'OFFLINE_PACKAGE_VALIDATION','skill_revision':'semantics-first-r02',
            'passed':sum(x['pass'] for x in checks),'failed':sum(not x['pass'] for x in checks),
            'checks':checks,'live_model_validation':'NOT_RUN','model_calls':0,
            'product_runtime_validation':'NOT_RUN','deployment':'NOT_PERFORMED',
            'independent_translation_semantic_validation':'NOT_RUN',
            'limitations':'File, metadata, section-anchor and small reference-logic checks only. No claim of complete translation equivalence, Schema execution, or bilingual parsing accuracy.'}

def main() -> int:
    try:
        report=run()
    except (OSError,ValueError,KeyError,TypeError) as exc:
        report={'kind':'OFFLINE_PACKAGE_VALIDATION','failed':1,'error':str(exc),
                'live_model_validation':'NOT_RUN','model_calls':0}
    (ROOT/'VALIDATION.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
    print(json.dumps({'passed':report.get('passed',0),'failed':report['failed'],
                      'live_model_validation':'NOT_RUN','model_calls':0},ensure_ascii=False))
    return 1 if report['failed'] else 0

if __name__=='__main__':
    sys.exit(main())
