export function isPublicSemanticSourceUrl(value) {
  if (typeof value !== 'string' || value.length > 2048 || !value.startsWith('https://')) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' && parsed.hostname.length > 0
      && parsed.username === '' && parsed.password === ''
      && parsed.search === '' && parsed.hash === '';
  } catch { return false; }
}
