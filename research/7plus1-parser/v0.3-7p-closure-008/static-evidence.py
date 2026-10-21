"""Bounded owned source inspection. ast.parse never executes target code.

Only direct declarations and one explicitly described directory/file/name
enumeration shape are accepted. All other behavior stays unsupported.
"""
import ast
import json
import sys
import textwrap


def inspect(code, symbol):
    clean = textwrap.dedent(code)
    original_lines = code.splitlines(keepends=True)
    lines = clean.splitlines(keepends=True)
    offsets = []
    total = 0
    for line in original_lines:
        offsets.append(total)
        total += len(line)

    def bounds(n):
        def point(line_no, byte_col):
            text = lines[line_no - 1]
            column = len(text.encode('utf-8')[:byte_col].decode('utf-8'))
            margin = len(original_lines[line_no - 1]) - len(text)
            return offsets[line_no - 1] + margin + column
        return [point(n.lineno, n.col_offset), point(n.end_lineno, n.end_col_offset)]

    try:
        tree = ast.parse(clean)
    except (SyntaxError, ValueError, RecursionError) as exc:
        return {'status': 'UNSUPPORTED', 'reason': 'MALFORMED_DECLARATION', 'detail': str(exc)}
    declarations = [n for n in tree.body if isinstance(n, (ast.FunctionDef, ast.AsyncFunctionDef)) and n.name == symbol]
    if len(declarations) != 1:
        return {'status': 'UNSUPPORTED', 'reason': 'DECLARATION_NOT_UNIQUE'}
    f = declarations[0]
    if isinstance(f, ast.AsyncFunctionDef) or f.decorator_list:
        return {'status': 'UNSUPPORTED', 'reason': 'ASYNC_OR_DECORATED_DECLARATION'}
    params = []
    positional = f.args.posonlyargs + f.args.args
    defaults = [None] * (len(positional) - len(f.args.defaults)) + f.args.defaults
    for index, (p, default) in enumerate(zip(positional, defaults)):
        params.append({'name': p.arg, 'kind': 'POSITIONAL_ONLY' if index < len(f.args.posonlyargs) else 'POSITIONAL_OR_KEYWORD', 'range': bounds(p), 'default_range': bounds(default) if default else None})
    if f.args.vararg:
        params.append({'name': f.args.vararg.arg, 'kind': 'VAR_POSITIONAL', 'range': bounds(f.args.vararg), 'default_range': None})
    for p, default in zip(f.args.kwonlyargs, f.args.kw_defaults):
        params.append({'name': p.arg, 'kind': 'KEYWORD_ONLY', 'range': bounds(p), 'default_range': bounds(default) if default else None})
    if f.args.kwarg:
        params.append({'name': f.args.kwarg.arg, 'kind': 'VAR_KEYWORD', 'range': bounds(f.args.kwarg), 'default_range': None})
    result = {'status': 'SIGNATURE_AVAILABLE', 'symbol': f.name, 'parameters': params, 'declaration_range': bounds(f), 'executed': False, 'behavior': {'status': 'UNSUPPORTED', 'reason': 'NO_SUPPORTED_BOUNDED_BEHAVIOR'}}
    body = list(f.body)
    doc = body.pop(0) if body and isinstance(body[0], ast.Expr) and isinstance(body[0].value, ast.Constant) and isinstance(body[0].value.value, str) else None
    if not doc or len(body) != 1 or not isinstance(body[0], ast.For):
        return result
    # The source explicitly states the intended behavior. Static shape below
    # cross-checks it; it is not a runtime correctness theorem.
    description = doc.value.value.casefold().replace('*', '')
    if not all(word in description for word in ('files', 'directories', 'basenames')) or not any(word in description for word in ('all given', 'every given', 'each given')):
        result['behavior']['reason'] = 'NO_EXPLICIT_DIRECTORY_FILE_NAME_CONTRACT'
        return result
    outer = body[0]
    if not isinstance(outer.target, ast.Name) or not isinstance(outer.iter, ast.Name) or outer.orelse:
        return result
    formal = next((p for p in params if p['name'] == outer.iter.id), None)
    if not formal or formal['kind'] != 'VAR_POSITIONAL':
        return result
    rows = list(outer.body)
    guard = None
    if rows and isinstance(rows[0], ast.If):
        guard = rows.pop(0)
        test = guard.test
        valid = isinstance(test, ast.UnaryOp) and isinstance(test.op, ast.Not) and isinstance(test.operand, ast.Call) and not test.operand.args and not test.operand.keywords
        method = test.operand.func if valid else None
        if not (isinstance(method, ast.Attribute) and isinstance(method.value, ast.Name) and method.value.id == outer.target.id and method.attr == 'is_dir' and len(guard.body) == 1 and isinstance(guard.body[0], ast.Continue) and not guard.orelse):
            return result
    if len(rows) != 1 or not isinstance(rows[0], ast.For):
        return result
    inner = rows[0]
    iterator = inner.iter
    if not (isinstance(inner.target, ast.Name) and isinstance(iterator, ast.Call) and not iterator.args and not iterator.keywords and isinstance(iterator.func, ast.Attribute) and isinstance(iterator.func.value, ast.Name) and iterator.func.value.id == outer.target.id and iterator.func.attr == 'iterdir' and not inner.orelse and len(inner.body) == 1 and isinstance(inner.body[0], ast.If)):
        return result
    only_file = inner.body[0]
    t = only_file.test
    if not (isinstance(t, ast.Call) and not t.args and not t.keywords and isinstance(t.func, ast.Attribute) and isinstance(t.func.value, ast.Name) and t.func.value.id == inner.target.id and t.func.attr == 'is_file' and not only_file.orelse and len(only_file.body) == 1):
        return result
    expression = only_file.body[0]
    y = expression.value if isinstance(expression, ast.Expr) else None
    yielded = y.value if isinstance(y, ast.Yield) else None
    if not (isinstance(yielded, ast.Attribute) and isinstance(yielded.value, ast.Name) and yielded.value.id == inner.target.id and yielded.attr == 'name'):
        return result
    result['behavior'] = {'status': 'SUPPORTED', 'formal_name': formal['name'], 'docstring_range': bounds(doc), 'iteration_range': bounds(outer), 'file_predicate_range': bounds(t), 'yield_range': bounds(y), 'argument_range': bounds(outer.iter), 'member_range': bounds(inner.target), 'name_range': bounds(yielded), 'directory_guard_range': bounds(guard) if guard else None, 'collection_operator': 'ALL', 'combination_operator': 'UNION', 'preserves_argument_order': True, 'statement': 'Explicit declared file-basename enumeration over every supplied directory; not an executed-code correctness result.'}
    return result


if __name__ == '__main__':
    try:
        request = json.load(sys.stdin)
        answer = inspect(request['code'], request['symbol'])
    except Exception as exc:
        answer = {'status': 'UNSUPPORTED', 'reason': 'STATIC_INSPECTION_ERROR', 'detail': str(exc), 'executed': False}
    print(json.dumps(answer, ensure_ascii=False))
