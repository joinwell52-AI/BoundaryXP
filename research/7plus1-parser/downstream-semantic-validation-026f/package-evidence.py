"""Archive byte-preserved research outputs; never remove or overwrite originals."""
import hashlib, json, pathlib, zipfile
ROOT = pathlib.Path(__file__).resolve().parents[3]
OUT = ROOT / 'docs/reports/7plus1/7P-DOWNSTREAM-SEMANTIC-VALIDATION-026F'
def digest(p):
    h = hashlib.sha256()
    with p.open('rb') as f:
        for b in iter(lambda: f.read(1024 * 1024), b''): h.update(b)
    return h.hexdigest()
def save(p, data):
    with p.open('x', encoding='utf-8', newline='\n') as f: f.write(json.dumps(data, ensure_ascii=False, indent=2)+'\n')
groups = {}
for revision in ['r001', 'r002']:
    base = OUT if revision == 'r001' else OUT/'compatibility-r002'
    for corpus in ['root', 'natural', 'exposed200']:
        arms = [['baseline'],['trial']] if corpus == 'exposed200' else [['baseline','trial']]
        for selected in arms:
            suffix = '-'+selected[0] if len(selected)==1 else ''
            groups[f'EVIDENCE-AUTOMATIC-{revision}-{corpus}{suffix}.zip'] = sorted(p for arm in selected for p in (base/'automatic'/arm/corpus).rglob('*') if p.is_file())
auto = {p for group in groups.values() for p in group}
groups['EVIDENCE-DIAGNOSTIC.zip'] = sorted(p for p in OUT.rglob('*') if p.is_file() and p not in auto and p.suffix != '.zip' and p.name not in {'MANIFEST.json','SHA256SUMS','SEAL.json','ARCHIVES.json'})
inventory=[]
for name, files in groups.items():
    target=OUT/name
    entries=[{'entry':p.relative_to(ROOT).as_posix(),'size':p.stat().st_size,'sha256':digest(p)} for p in files]
    if not target.exists():
        with zipfile.ZipFile(target,'x',compression=zipfile.ZIP_DEFLATED,compresslevel=6,allowZip64=True) as z:
            for p in files:
                entry=p.relative_to(ROOT).as_posix()
                info=zipfile.ZipInfo(entry, date_time=(1980,1,1,0,0,0))
                info.compress_type=zipfile.ZIP_DEFLATED
                info.external_attr=0o100644<<16
                with p.open('rb') as src, z.open(info,'w',force_zip64=True) as dst:
                    for b in iter(lambda: src.read(1024*1024),b''): dst.write(b)
    if target.stat().st_size >= 95*1024*1024: raise RuntimeError('Archive too large for scoped Git delivery '+name)
    with zipfile.ZipFile(target) as z:
        if set(z.namelist()) != {row['entry'] for row in entries}: raise RuntimeError('Existing ZIP entries differ '+name)
        bad=z.testzip()
        if bad: raise RuntimeError('ZIP CRC failure '+bad)
        for row in entries:
            h=hashlib.sha256()
            with z.open(row['entry']) as f:
                for b in iter(lambda:f.read(1024*1024),b''): h.update(b)
            if h.hexdigest()!=row['sha256']: raise RuntimeError('ZIP SHA mismatch '+row['entry'])
    inventory.append({'file':target.relative_to(ROOT).as_posix(),'size':target.stat().st_size,'sha256':digest(target),'entries':entries})
    print(name, len(entries), target.stat().st_size, flush=True)
save(OUT/'ARCHIVES.json', {'zip_entry_crc_and_sha256_verified':True,'raw_files_preserved':True,'archives':inventory})
