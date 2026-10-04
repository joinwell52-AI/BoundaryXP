export function containsLexicalTerm(source, term) {
  if (typeof term !== 'string' || !term.trim()) return false;
  const fold = value => value.replace(/[A-Z]/g, char => char.toLowerCase());
  const text = fold(source), needle = fold(term.trim());
  let offset = text.indexOf(needle);
  while (offset >= 0) {
    const before = text[offset - 1] ?? '', after = text[offset + needle.length] ?? '';
    if ((!/^[a-z0-9_]/.test(needle) || !/[a-z0-9_]/.test(before))
      && (!/[a-z0-9_]$/.test(needle) || !/[a-z0-9_]/.test(after))) return true;
    offset = text.indexOf(needle, offset + 1);
  }
  return false;
}
