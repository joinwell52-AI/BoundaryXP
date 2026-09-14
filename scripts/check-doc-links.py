import argparse
import html
import json
from pathlib import Path
import re
import subprocess
import unicodedata
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parents[1]
INLINE = re.compile(r'!?\[[^\]\n]*\]\((<[^>]+>|[^\s)]+)(?:\s+"[^"\n]*")?\)')
REFERENCE = re.compile(r'^\s{0,3}\[([^\]]+)\]:\s*(<[^>]+>|\S+)')
REFERENCE_USE = re.compile(r'!?\[([^\]\n]+)\]\[([^\]\n]*)\]')
HTML_LINK = re.compile(r'<(?:a|img)\b[^>]*?\b(?:href|src)=["\']([^"\']+)["\']', re.I)
AUTOLINK = re.compile(r'<(https?://[^>\s]+)>')


def prose_lines(text):
    fence = None
    for number, line in enumerate(text.splitlines(), 1):
        marker = re.match(r'^\s{0,3}(`{3,}|~{3,})', line)
        if marker:
            token = marker.group(1)
            if fence is None:
                fence = token
            elif token[0] == fence[0] and len(token) >= len(fence):
                fence = None
            continue
        if fence is None:
            yield number, line


def document_links(text):
    lines = list(prose_lines(text))
    references = {}
    for number, line in lines:
        match = REFERENCE.match(line)
        if match:
            references[match.group(1).casefold()] = match.group(2).strip('<>')
            yield number, match.group(2).strip('<>')
    for number, line in lines:
        if REFERENCE.match(line):
            continue
        line = re.sub(r'(`+).*?\1', '', line)
        for pattern in (INLINE, HTML_LINK, AUTOLINK):
            for match in pattern.finditer(line):
                yield number, html.unescape(match.group(1).strip('<>'))
        for match in REFERENCE_USE.finditer(line):
            label = (match.group(2) or match.group(1)).casefold()
            yield number, references.get(label, 'missing-reference:' + label)


def anchors(text):
    result = set(re.findall(r'<[^>]+\b(?:id|name)=["\']([^"\']+)["\']', text))
    counts = {}
    for _, line in prose_lines(text):
        heading = re.match(r'^ {0,3}#{1,6}\s+(.+?)(?:\s+#+)?\s*$', line)
        if not heading:
            continue
        value = re.sub(r'<[^>]+>', '', heading.group(1))
        value = re.sub(r'\[([^\]]+)\]\([^)]*\)', r'\1', value)
        value = html.unescape(value).lower()
        value = ''.join(character for character in value if character in '-_ '
                        or not unicodedata.category(character).startswith(('P', 'S', 'C')))
        value = value.replace(' ', '-')
        duplicate = counts.get(value, 0)
        counts[value] = duplicate + 1
        result.add(value if duplicate == 0 else f'{value}-{duplicate}')
    return result


def audit(root=ROOT):
    listed = subprocess.check_output(['git', 'ls-files', '--cached', '--others', '--exclude-standard', '-z', '--', '*.md'], cwd=root).decode('utf-8').split('\0')
    names = sorted({name for name in listed if name and (root / name).is_file()})
    problems = []
    external = {}
    local_count = 0
    for name in filter(None, names):
        path = root / name
        for number, target in document_links(path.read_text(encoding='utf-8')):
            parsed = urlsplit(target)
            record = {'file': name, 'line': number, 'target': target}
            if parsed.scheme in ('http', 'https'):
                external.setdefault(target, []).append({'file': name, 'line': number})
                continue
            if parsed.scheme == 'missing-reference':
                problems.append({**record, 'reason': 'undefined reference'})
                continue
            if parsed.scheme or target.startswith('//'):
                continue
            local_count += 1
            destination = (path.parent / unquote(parsed.path)).resolve() if parsed.path else path
            if not destination.is_relative_to(root.resolve()):
                problems.append({**record, 'reason': 'outside standalone repository'})
            elif not destination.exists():
                problems.append({**record, 'reason': 'missing local target'})
            elif parsed.fragment and destination.suffix.lower() == '.md':
                fragment = unquote(parsed.fragment)
                if fragment not in anchors(destination.read_text(encoding='utf-8')):
                    problems.append({**record, 'reason': 'missing Markdown anchor'})
    return {'documents': len(list(filter(None, names))), 'local_links': local_count,
            'problems': problems, 'external': external}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Check repository Markdown file links and heading anchors without network access.')
    parser.add_argument('--json', action='store_true', help='Include an external URL inventory; no remote availability claim is made.')
    options = parser.parse_args()
    report = audit()
    if options.json:
        print(json.dumps(report, ensure_ascii=False, indent=2))
    else:
        for problem in report['problems']:
            print(f"{problem['file']}:{problem['line']}: {problem['reason']}: {problem['target']}")
        print(f"Documents: {report['documents']}; local links: {report['local_links']}; problems: {len(report['problems'])}")
    raise SystemExit(bool(report['problems']))
