import hashlib
from pathlib import Path, PurePosixPath


def verify_registered_resource_metadata(manifest, resource, registry):
    definition = registry.get(resource)
    if not isinstance(definition, dict) or manifest.get('resource_kind') != definition.get('resource_kind'):
        raise ValueError('SEMANTIC_RESOURCE_KIND_MISMATCH')
    license_info = manifest.get('license', {})
    if license_info.get('spdx') != definition.get('license') \
            or license_info.get('source_url') != definition.get('license_source_url'):
        raise ValueError('SEMANTIC_RESOURCE_LICENSE_MISMATCH')
    if manifest.get('source_url') != f"https://huggingface.co/{definition['repo_id']}/tree/{manifest.get('revision')}":
        raise ValueError('SEMANTIC_RESOURCE_SOURCE_MISMATCH')
    runtime = manifest.get('runtime', {})
    if runtime.get('framework') != definition.get('framework') \
            or runtime.get('offline_probe') != definition.get('offline_probe'):
        raise ValueError('SEMANTIC_RESOURCE_RUNTIME_MISMATCH')


def verify_resource_files(directory, manifest):
    if directory.is_symlink() or not directory.is_dir():
        raise ValueError('SEMANTIC_RESOURCE_DIRECTORY_INVALID')
    if (directory / 'MANIFEST.json').is_symlink():
        raise ValueError('SEMANTIC_RESOURCE_PATH_INVALID')
    license_info = manifest.get('license')
    if manifest.get('format') != 'boundx-semantic-resource-manifest/experimental-v1' \
            or not isinstance(manifest.get('resource_id'), str) or not manifest['resource_id'] \
            or not isinstance(manifest.get('revision'), str) or not manifest['revision'] \
            or manifest.get('resource_kind') not in ('embedding-model', 'nli-model', 'syntax-model', 'l1', 'l2', 'l3-ontology', 'l3-facts') \
            or not isinstance(license_info, dict) or not isinstance(license_info.get('spdx'), str) or not license_info['spdx'] \
            or not isinstance(license_info.get('source_url'), str) or not license_info['source_url'].startswith('https://'):
        raise ValueError('SEMANTIC_RESOURCE_MANIFEST_INVALID')
    files = manifest.get('files')
    if not isinstance(files, list) or not 0 < len(files) <= 4096:
        raise ValueError('SEMANTIC_RESOURCE_MANIFEST_INVALID')
    seen = set()
    for descriptor in files:
        if not isinstance(descriptor, dict) or not isinstance(descriptor.get('path'), str):
            raise ValueError('SEMANTIC_RESOURCE_MANIFEST_INVALID')
        name = descriptor['path']
        path = PurePosixPath(name)
        if path.is_absolute() or '\\' in name or ':' in name or any(part in ('', '.', '..') for part in name.split('/')) \
                or name in seen or name == 'MANIFEST.json':
            raise ValueError('SEMANTIC_RESOURCE_PATH_INVALID')
        seen.add(name)
        target = directory
        for part in path.parts:
            target = target / part
            if target.is_symlink():
                raise ValueError('SEMANTIC_RESOURCE_PATH_INVALID')
        if not target.is_file():
            raise ValueError('MODEL_RESOURCE_UNAVAILABLE')
        expected_bytes = descriptor.get('bytes')
        expected_sha = descriptor.get('sha256')
        if type(expected_bytes) is not int or expected_bytes < 0 or not isinstance(expected_sha, str) \
                or len(expected_sha) != 64 or any(char not in '0123456789abcdef' for char in expected_sha):
            raise ValueError('SEMANTIC_RESOURCE_MANIFEST_INVALID')
        if target.stat().st_size != expected_bytes:
            raise ValueError('SEMANTIC_RESOURCE_SIZE_MISMATCH')
        digest = hashlib.sha256()
        with target.open('rb') as handle:
            for block in iter(lambda: handle.read(1024 * 1024), b''):
                digest.update(block)
        if digest.hexdigest() != expected_sha:
            raise ValueError('SEMANTIC_RESOURCE_SHA256_MISMATCH')
    actual = set()
    for path in directory.rglob('*'):
        relative = path.relative_to(directory)
        if path.is_symlink():
            raise ValueError('SEMANTIC_RESOURCE_PATH_INVALID')
        if '.cache' in relative.parent.parts:
            continue
        if path.name == '.cache' and path.is_dir():
            continue
        if path.is_file() and relative != Path('MANIFEST.json'):
            actual.add(relative.as_posix())
    if actual != seen:
        raise ValueError('SEMANTIC_RESOURCE_FILE_INVENTORY_MISMATCH')
