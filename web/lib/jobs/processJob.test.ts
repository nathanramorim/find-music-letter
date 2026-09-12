import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../scraper/fetchLyrics', () => ({
  fetchLyrics: vi.fn(async (artist: string | null, song: string) => {
    if (song === 'Música Desconhecida') return null
    return { artist: artist ?? 'Artista Desconhecido', title: song, lyrics: 'Linha 1\nLinha 2' }
  }),
}))

const { processSongs } = await import('./processJob')

describe('processSongs', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('processes every song, tracks per-song failures, and returns a downloadable document', async () => {
    const result = await processSongs({
      songs: [
        { artist: 'Legião Urbana', song: 'Tempo Perdido' },
        { artist: null, song: 'Música Desconhecida' },
      ],
      format: 'docx',
      mode: 'merged',
    })

    expect(result.results).toEqual([
      { label: 'Legião Urbana - Tempo Perdido', ok: true },
      { label: 'Música Desconhecida', ok: false },
    ])
    expect(result.filename).toMatch(/\.docx$/)
    expect(result.data.length).toBeGreaterThan(0)
  })

  it('throws when no song is found', async () => {
    await expect(
      processSongs({
        songs: [{ artist: null, song: 'Música Desconhecida' }],
        format: 'pdf',
        mode: 'separate',
      })
    ).rejects.toThrow('Nenhuma música encontrada.')
  })
})
