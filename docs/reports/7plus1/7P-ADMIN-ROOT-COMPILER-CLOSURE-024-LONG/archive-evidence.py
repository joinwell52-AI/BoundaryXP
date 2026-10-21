import pathlib, zipfile, hashlib, json

ROOT = pathlib.Path('docs/reports/7plus1/7P-ADMIN-ROOT-COMPILER-CLOSURE-024-LONG')
DEST = ROOT / 'raw-evidence-archives'
DEST.mkdir(exist_ok=True)
def digest(p):
    h = hashlib.sha256()
    with p.open('rb') as f:
        while True:
            chunk = f.read(1024 * 1024)
            if not chunk: break
            h.update(chunk)
    return h.hexdigest()

# Lossless Git delivery of every superseded first output. The local originals
# are retained. Current actual-model output and holdout remain directly visible.
groups = list((ROOT / 'development').iterdir())
groups += [p for p in (ROOT / 'root-model').iterdir() if p.name != 'r04']
groups += [p for p in (ROOT / 'model-prevalidation').iterdir()]
index = []
for group in sorted(groups):
    if not group.is_dir(): continue
    archive = DEST / (group.parent.name + '-' + group.name + '.zip')
    files = sorted(p for p in group.rglob('*') if p.is_file())
    entries = []
    with zipfile.ZipFile(archive, 'x', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        for p in files:
            member = p.relative_to(ROOT).as_posix()
            z.write(p, member)
            entries.append({'member': member, 'sha256': digest(p), 'bytes': p.stat().st_size})
    with zipfile.ZipFile(archive) as z:
        if z.testzip() is not None: raise RuntimeError('ZIP_CRC_FAILURE')
        for entry in entries:
            if hashlib.sha256(z.read(entry['member'])).hexdigest() != entry['sha256']:
                raise RuntimeError('ZIP_CONTENT_CHANGED')
    index.append({'archive': archive.relative_to(ROOT).as_posix(), 'sha256': digest(archive), 'bytes': archive.stat().st_size, 'lossless_verified': True, 'members': entries})
with (ROOT / 'RAW-EVIDENCE-ARCHIVE-INDEX.json').open('x', encoding='utf-8', newline='\n') as f:
    json.dump({'local_originals_retained': True, 'previous_first_failures_not_overwritten': True, 'archives': index}, f, ensure_ascii=False, indent=2)
    f.write('\n')
print(json.dumps({'archives': len(index), 'raw_files': sum(len(x['members']) for x in index), 'archive_bytes': sum(x['bytes'] for x in index)}))
