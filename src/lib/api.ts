const API_BASE = '/api';

export const apiRequest = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    let errorMsg = res.statusText;
    try {
      const body = await res.json();
      errorMsg = body.error || errorMsg;
  } catch {
    /* ignore */
  }
    throw new Error(errorMsg);
  }
  return res.json() as Promise<T>;
};
