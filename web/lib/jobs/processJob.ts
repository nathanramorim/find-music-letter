import JSZip from 'jszip'
import { fetchLyrics } from '../scraper/fetchLyrics'
import { generateCombinedDocx, generateDocx } from '../docgen/generateDocx'
import { generateCombinedPdf, generatePdf } from '../docgen/generatePdf'
import type { SongDocument } from '../docgen/types'
import { slugify } from '../parsing/slugify'
import type { JobOptions, JobResultEntry, ProcessResult } from './types'

/** Minimum delay between requests to the source site, mirrors DELAY_SECONDS in find_lyrics.py. */
const DELAY_MS = process.env.VITEST ? 0 : 1500

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Fetches lyrics for every song and generates the output document(s), all
 * within a single call so the whole flow runs inside one request/response
 * (no cross-request state, which Vercel serverless functions don't share
 * reliably between invocations).
 */
export async function processSongs(options: JobOptions): Promise<ProcessResult> {
  const songs: SongDocument[] = []
  const results: JobResultEntry[] = []

  for (let i = 0; i < options.songs.length; i++) {
    const { artist, song } = options.songs[i]
    const label = artist ? `${artist} - ${song}` : song

    const found = await fetchLyrics(artist, song)
    if (found) {
      songs.push({ artist: found.artist || artist || '', title: found.title, lyrics: found.lyrics })
      results.push({ label, ok: true })
    } else {
      results.push({ label, ok: false })
    }

    if (i < options.songs.length - 1) {
      await sleep(DELAY_MS)
    }
  }

  if (songs.length === 0) {
    throw new Error('Nenhuma música encontrada.')
  }

  const { filename, contentType, data } = await buildOutput(songs, options)
  return { filename, contentType, data, results }
}

async function buildOutput(songs: SongDocument[], options: JobOptions) {
  const baseName = `repertorio-${Date.now().toString(36)}`

  if (options.mode === 'merged') {
    const data =
      options.format === 'docx' ? await generateCombinedDocx(songs) : await generateCombinedPdf(songs)
    const contentType =
      options.format === 'docx'
        ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        : 'application/pdf'
    return { filename: `${baseName}.${options.format}`, contentType, data }
  }

  const zip = new JSZip()
  for (const song of songs) {
    const data = options.format === 'docx' ? await generateDocx(song) : await generatePdf(song)
    const filename = `${slugify(song.artist || 'desconhecido')}-${slugify(song.title)}.${options.format}`
    zip.file(filename, data)
  }
  const zipData = await zip.generateAsync({ type: 'nodebuffer' })
  return { filename: `${baseName}.zip`, contentType: 'application/zip', data: zipData }
}
