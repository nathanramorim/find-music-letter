export interface LetrasLink {
  artistName: string
  songName: string
  fullUrl: string
}

const BASE_URL = 'https://www.letras.mus.br'

/**
 * Extracts (artistName, songName, fullUrl) from a letras.mus.br href.
 * Supports both `/artista-musicas/ID/` and `/artista/musica/` link shapes.
 */
export function extractLetrasUrlFromHref(href: string): LetrasLink | null {
  const match = href.match(/letras\.mus\.br\/([^/?#]+)\/([^/?#]+)/)
  if (!match) return null

  const [, artistSlug, songSlug] = match
  const fullUrl = `${BASE_URL}/${artistSlug}/${songSlug}/`

  const cleanArtistSlug = artistSlug.replace(/-musicas$/, '')
  const artistName = titleCase(cleanArtistSlug.replace(/-/g, ' '))

  const songName = /^\d+$/.test(songSlug) ? songSlug : titleCase(songSlug.replace(/-/g, ' '))

  return { artistName, songName, fullUrl }
}

function titleCase(text: string): string {
  return text.replace(/\w\S*/g, (word) => word[0].toUpperCase() + word.slice(1))
}
