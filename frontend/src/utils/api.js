const BASE = import.meta.env.VITE_API_URL || '/api';

export async function api(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
