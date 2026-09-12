export interface SongRequest {
  artist: string | null
  song: string
}

/**
 * Parses a songs list in the `Artista - Música` format (one per line).
 * Blank lines and lines starting with `#` are ignored, mirroring
 * `parse_songs_file` from the original find_lyrics.py CLI.
 */
export function parseSongsText(text: string): SongRequest[] {
  const songs: SongRequest[] = []

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue

    const sepIndex = line.indexOf(' - ')
    if (sepIndex !== -1) {
      const artist = line.slice(0, sepIndex).trim()
      const song = line.slice(sepIndex + 3).trim()
      songs.push({ artist, song })
    } else {
      songs.push({ artist: null, song: line })
    }
  }

  return songs
}
