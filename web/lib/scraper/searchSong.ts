import * as cheerio from 'cheerio'
import { fetchHtml } from './http'
import { extractLetrasUrlFromHref, type LetrasLink } from './extractLetrasUrl'

const BASE_URL = 'https://www.letras.mus.br'

async function searchViaLetras(query: string): Promise<LetrasLink | null> {
  const searchUrl = `${BASE_URL}/busca/?q=${encodeURIComponent(query)}`
  const html = await fetchHtml(searchUrl)
  if (!html) return null

  const $ = cheerio.load(html)
  const result = $('ul.list-nav a[href]').first().length
    ? $('ul.list-nav a[href]').first()
    : $('.g-link').first()

  if (!result.length) return null

  const href = result.attr('href')
  if (!href) return null

  const link = extractLetrasUrlFromHref(href)
  if (!link) return null

  const linkText = result.text().trim()
  const dashIndex = linkText.indexOf(' - ')
  if (dashIndex !== -1) {
    link.songName = linkText.slice(0, dashIndex).trim()
    link.artistName = linkText.slice(dashIndex + 3).trim()
  }

  return link
}

/** DuckDuckGo HTML endpoint, used as fallback when direct search is blocked. */
async function searchViaDuckDuckGo(query: string): Promise<LetrasLink | null> {
  const searchQuery = `${query} letras.mus.br`
  const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(searchQuery)}`
  const html = await fetchHtml(searchUrl)
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
 * Searches by song title (and optionally artist). Tries letras.mus.br
 * directly and falls back to DuckDuckGo when blocked; mirrors
 * `search_song` from find_lyrics.py.
 */
export async function searchSong(query: string): Promise<LetrasLink | null> {
  const direct = await searchViaLetras(query)
  if (direct) return direct

  return searchViaDuckDuckGo(query)
}
