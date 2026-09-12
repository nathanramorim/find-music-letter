const REALISTIC_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
}

/**
 * Fetches a URL with browser-like headers. Node's fetch cannot replicate
 * curl_cffi's TLS fingerprint impersonation used by the original CLI to
 * bypass Cloudflare; this is a best-effort mitigation, not a guaranteed
 * equivalent (see criteria-89a1-webapp-nextjs.md).
 */
export async function fetchHtml(url: string, timeoutMs = 15000): Promise<string | null> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, {
      headers: REALISTIC_HEADERS,
      signal: controller.signal,
    })
    if (!response.ok) return null
    return await response.text()
  } catch {
    return null
  } finally {
    clearTimeout(timeout)
  }
}
