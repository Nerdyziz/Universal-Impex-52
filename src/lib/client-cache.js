"use client";

const DEFAULT_TTL = 5 * 60 * 1000;
const CACHE_PREFIX = "ui52:json:";

export async function cachedJsonFetch(url, { ttl = DEFAULT_TTL, signal } = {}) {
  if (typeof window === "undefined") {
    const response = await fetch(url, { signal });
    return response.json();
  }

  const key = `${CACHE_PREFIX}${url}`;
  const now = Date.now();

  try {
    const cached = sessionStorage.getItem(key);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed.expires > now) return parsed.data;
    }
  } catch {}

  const response = await fetch(url, { signal });
  const data = await response.json();

  try {
    sessionStorage.setItem(
      key,
      JSON.stringify({
        data,
        expires: now + ttl,
      }),
    );
  } catch {}

  return data;
}
