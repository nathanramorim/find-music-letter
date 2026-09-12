import * as cheerio from 'cheerio'
import type { AnyNode } from 'domhandler'
import { fetchHtml } from './http'
import { searchSong } from './searchSong'

export interface LyricsResult {
  artist: string
  title: string
  lyrics: string
}

/**
 * Fetches lyrics for a song, resolving the real letras.mus.br URL via
 * search first (the site uses numeric IDs, not predictable slugs).
 * Mirrors `fetch_lyrics` from find_lyrics.py, including the print-page
 * parsing (div.page > .page-header / .page-container).
 */
export async function fetchLyrics(
  artist: string | null,
  song: string
): Promise<LyricsResult | null> {
  const query = artist ? `${artist} ${song}` : song
  const link = await searchSong(query)
  if (!link) return null

  const printUrl = `${link.fullUrl.replace(/\/$/, '')}/print.html`
  const html = await fetchHtml(printUrl)
  if (!html) return null

  const $ = cheerio.load(html)
  const pageDiv = $('div.page').first()
  if (!pageDiv.length) return null

  const header = pageDiv.find('div.page-header').first()
  let pageTitle = song
  let resolvedArtist = link.artistName
  if (header.length) {
    const h1 = header.find('h1').first()
    const h2 = header.find('h2').first()
    if (h1.length) pageTitle = h1.text().trim()
    if (!resolvedArtist && h2.length) resolvedArtist = h2.text().trim()
  }

  const containers = pageDiv.find('div.page-container')
  if (!containers.length) return null

  const stanzas: string[] = []
  containers.each((_i, container) => {
    let currentStanza: string[] = []
    const children = $(container).contents().toArray()

    for (const child of children) {
      const node = child as AnyNode & { name?: string }
      if (node.type === 'tag' && node.name === 'br') {
        if (currentStanza.length) {
          stanzas.push(currentStanza.join('\n'))
          currentStanza = []
        }
      } else if (node.type === 'tag' && node.name === 'div') {
        const text = $(node).text().trim()
        if (text) currentStanza.push(text)
      }
    }
    if (currentStanza.length) stanzas.push(currentStanza.join('\n'))
  })

  const fullLyrics = stanzas.join('\n\n')
  if (!fullLyrics.trim()) return null

  return { artist: resolvedArtist, title: pageTitle, lyrics: fullLyrics }
}
