import { NextResponse } from 'next/server'
import { fetchLyrics } from '@/lib/scraper/fetchLyrics'

export const runtime = 'nodejs'
export const maxDuration = 60

interface LyricsBody {
  artist: string | null
  song: string
}

/** Looks up a single song. Stateless, so it works on any serverless instance. */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Partial<LyricsBody>

  if (!body.song || typeof body.song !== 'string') {
    return NextResponse.json({ error: 'song é obrigatório' }, { status: 400 })
  }
  const artist = typeof body.artist === 'string' && body.artist ? body.artist : null

  const found = await fetchLyrics(artist, body.song)
  if (!found) return NextResponse.json({ found: null })

  return NextResponse.json({
    found: { artist: found.artist || artist || '', title: found.title, lyrics: found.lyrics },
  })
}
