import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createJob, getJob } from './jobStore'
import { getResult } from '../storage/tempStorage'

vi.mock('../scraper/fetchLyrics', () => ({
  fetchLyrics: vi.fn(async (artist: string | null, song: string) => {
    if (song === 'Música Desconhecida') return null
    return { artist: artist ?? 'Artista Desconhecido', title: song, lyrics: 'Linha 1\nLinha 2' }
  }),
}))

const { runJob } = await import('./processJob')

describe('runJob', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('processes every song, tracks per-song failures, and produces a downloadable result', async () => {
    const options = {
      songs: [
        { artist: 'Legião Urbana', song: 'Tempo Perdido' },
        { artist: null, song: 'Música Desconhecida' },
      ],
      format: 'docx' as const,
      mode: 'merged' as const,
    }

    const job = createJob(options)
    await runJob(job.id, options)

    const finished = getJob(job.id)
    expect(finished?.status).toBe('done')
    expect(finished?.processed).toBe(2)
    expect(finished?.results).toEqual([
      { label: 'Legião Urbana - Tempo Perdido', ok: true },
      { label: 'Música Desconhecida', ok: false },
    ])

    const result = getResult(job.id)
    expect(result?.filename).toMatch(/\.docx$/)
  })

  it('marks the job as error when no song is found', async () => {
    const options = {
      songs: [{ artist: null, song: 'Música Desconhecida' }],
      format: 'pdf' as const,
      mode: 'separate' as const,
    }

    const job = createJob(options)
    await runJob(job.id, options)

    expect(getJob(job.id)?.status).toBe('error')
  })
})
