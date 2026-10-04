from pathlib import Path
import hashlib,json,tarfile
workspace=Path('.').resolve()
root=Path('docs/reports/7plus1/7P-ADMIN-NATURAL-021-LONG')
authorized=(workspace/root).resolve()
index=json.loads((root/'ARCHIVE-INDEX.json').read_text(encoding='utf8'))
count=0
for a in index['archives']:
    archive=Path(a['archive_path'])
    assert hashlib.sha256(archive.read_bytes()).hexdigest()==a['sha256']
    expected={f['path']:f for f in a['files']}
    with tarfile.open(archive,'r:gz') as t:
        assert {m.name for m in t.getmembers()}==set(expected)
        for m in t.getmembers():
            target=(workspace/m.name).resolve()
            assert target.is_relative_to(authorized) and m.isfile(),m.name
            data=t.extractfile(m).read();f=expected[m.name]
            assert len(data)==f['bytes'] and hashlib.sha256(data).hexdigest()==f['sha256']
            if target.exists():assert hashlib.sha256(target.read_bytes()).hexdigest()==f['sha256'],m.name
            else:target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(data)
            count+=1
print('ORIGINAL_EVIDENCE_BYTES_VERIFIED_OR_RESTORED',count)
