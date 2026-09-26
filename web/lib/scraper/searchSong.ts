import * as cheerio from 'cheerio'
import { fetchHtml } from './http'
import { extractLetrasUrlFromHref, type LetrasLink } from './extractLetrasUrl'

const BASE_URL = 'https://www.letras.mus.br'

/** Kept short so a slow search source can't stall a song past the function time limit. */
const SEARCH_TIMEOUT_MS = 8000

/**
 * letras.mus.br's own autocomplete API (the `/busca/` page is rendered
 * client-side, so its server HTML never contains results). Returns JSONP:
 * `LetrasSug({"response":{"docs":[{"dns":"artist-slug","url":"song-slug","txt":"Song","art":"Artist","t":"2"}]}})`
 * where `t: "2"` marks a song (vs. artists, albums, etc.).
 */
const SUGGEST_URL = 'https://solr.sscdn.co/letras/m1/'

interface SuggestDoc {
  dns?: string
  url?: string
  txt?: string
  art?: string
  t?: string | number
}

export function parseSuggestResponse(body: string): LetrasLink | null {
  const start = body.indexOf('{')
  const end = body.lastIndexOf('}')
  if (start === -1 || end <= start) return null

  let docs: SuggestDoc[]
  try {
    docs = JSON.parse(body.slice(start, end + 1))?.response?.docs ?? []
  } catch {
    return null
  }

  const doc = docs.find((d) => String(d.t) === '2' && d.dns && d.url)
  if (!doc) return null

  return {
    artistName: doc.art?.trim() || doc.dns!,
    songName: doc.txt?.trim() || doc.url!,
    fullUrl: `${BASE_URL}/${doc.dns}/${doc.url}/`,
  }
}

async function searchViaLetrasSuggest(query: string): Promise<LetrasLink | null> {
  const url = `${SUGGEST_URL}?q=${encodeURIComponent(query)}&wt=json&callback=LetrasSug`
  const body = await fetchHtml(url, SEARCH_TIMEOUT_MS)
  if (!body) return null
  return parseSuggestResponse(body)
}

/** DuckDuckGo HTML endpoint, used as last-resort fallback. */
async function searchViaDuckDuckGo(query: string): Promise<LetrasLink | null> {
  const searchQuery = `${query} letras.mus.br`
  const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(searchQuery)}`
  const html = await fetchHtml(searchUrl, SEARCH_TIMEOUT_MS)
  if (!html) return null

  const $ = cheerio.load(html)
  const results = $('a.result__a')

  for (const el of results.toArray()) {
    const href = $(el).attr('href') ?? ''
    if (!href.includes('letras.mus.br')) continue

    const link = extractLetrasUrlFromHref(decodeURIComponent(href))
    if (!link) continue

    const title = $(el).text().trim()
    // DuckDuckGo result titles often append the site name (ex: "Song - Artist - LETRAS.MUS.BR").
    const parts = title.split(' - ').filter((part) => !/^letras\.mus\.br$/i.test(part.trim()))
    if (parts.length >= 2) {
      link.songName = parts[0].trim()
      link.artistName = parts[parts.length - 1].trim()
    }
    return link
  }

  return null
}

/**
 * Searches by song title (and optionally artist). Tries each query against
 * the letras.mus.br suggest API, then falls back to DuckDuckGo.
 */
export async function searchSong(query: string, ...alternatives: string[]): Promise<LetrasLink | null> {
  const queries = [query, ...alternatives].filter((q, i, all) => q && all.indexOf(q) === i)

  for (const q of queries) {
    const found = await searchViaLetrasSuggest(q)
    if (found) return found
  }

  const fallback = await searchViaDuckDuckGo(query)
  if (!fallback) console.warn(`[searchSong] nenhum resultado para "${query}"`)
  return fallback
}
