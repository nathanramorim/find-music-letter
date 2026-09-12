import * as cheerio from 'cheerio'
import { fetchHtml } from './http'
import { extractLetrasUrlFromHref, type LetrasLink } from './extractLetrasUrl'
import { slugify } from '../parsing/slugify'

const BASE_URL = 'https://www.letras.mus.br'

interface SolrDoc {
  art: string
  dns: string
  txt: string
  t: string
  url: string
}

/**
 * The instant-search API that powers letras.mus.br's own search box
 * (`solr.sscdn.co`). Unlike scraping a general-purpose search engine,
 * this is the site's own public read endpoint, so it isn't subject to
 * anti-bot blocking of datacenter IPs.
 */
async function searchViaSolr(query: string, artistHint?: string | null): Promise<LetrasLink | null> {
  const searchUrl = `https://solr.sscdn.co/letras/m1/?wt=json&q=${encodeURIComponent(query)}`
  const body = await fetchHtml(searchUrl)
  if (!body) return null

  // Response is JSONP-wrapped (`LetrasSug({...})`) regardless of the callback param.
  const jsonText = body.replace(/^[^(]*\(/, '').replace(/\);?\s*$/, '')

  let docs: SolrDoc[]
  try {
    docs = JSON.parse(jsonText)?.response?.docs ?? []
  } catch {
    return null
  }

  const songs = docs.filter((doc) => doc.t === '2')
  if (songs.length === 0) return null

  // Solr ranks by full-text relevance, which can surface a same-titled song by
  // a different artist. When the caller knows the artist, prefer a doc whose
  // artist actually matches instead of blindly trusting the top score.
  const artistSlug = artistHint ? slugify(artistHint) : null
  const song = (artistSlug && songs.find((doc) => slugify(doc.art).includes(artistSlug))) || songs[0]

  return {
    artistName: song.art,
    songName: song.txt,
    fullUrl: `${BASE_URL}/${song.dns}/${song.url}/`,
  }
}

/** DuckDuckGo HTML endpoint, used as fallback when the Solr search finds nothing. */
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

/** Decodes a Bing tracking redirect (`bing.com/ck/a?...&u=a1<base64url>`) to its real target URL. */
function decodeBingRedirect(href: string): string | null {
  const match = href.match(/[?&]u=a1([A-Za-z0-9_-]+)/)
  if (!match) return href
  const padded = match[1] + '='.repeat((4 - (match[1].length % 4)) % 4)
  try {
    return Buffer.from(padded, 'base64url').toString('utf-8')
  } catch {
    return null
  }
}

/** Bing HTML search, used as a last-resort fallback (also bot-challenges datacenter IPs, but less consistently than DuckDuckGo). */
async function searchViaBing(query: string): Promise<LetrasLink | null> {
  const searchQuery = `${query} letras.mus.br`
  const searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(searchQuery)}`
  const html = await fetchHtml(searchUrl)
  if (!html) return null

  const $ = cheerio.load(html)

  for (const el of $('li.b_algo h2 a[href]').toArray()) {
    const rawHref = $(el).attr('href') ?? ''
    const resolvedHref = decodeBingRedirect(rawHref)
    if (!resolvedHref || !resolvedHref.includes('letras.mus.br')) continue

    const link = extractLetrasUrlFromHref(resolvedHref)
    if (!link) continue

    const title = $(el).text().trim()
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
 * Searches by song title (and optionally artist). Tries letras.mus.br's
 * own Solr-backed search API first (reliable, not anti-bot blocked),
 * falling back to DuckDuckGo then Bing HTML scraping only if that finds
 * nothing.
 */
export async function searchSong(query: string, artistHint?: string | null): Promise<LetrasLink | null> {
  const direct = await searchViaSolr(query, artistHint)
  if (direct) return direct

  const viaDuckDuckGo = await searchViaDuckDuckGo(query)
  if (viaDuckDuckGo) return viaDuckDuckGo

  return searchViaBing(query)
}
