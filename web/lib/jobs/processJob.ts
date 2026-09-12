import JSZip from 'jszip'
import { fetchLyrics } from '../scraper/fetchLyrics'
import { generateCombinedDocx, generateDocx } from '../docgen/generateDocx'
import { generateCombinedPdf, generatePdf } from '../docgen/generatePdf'
import type { SongDocument } from '../docgen/types'
import { slugify } from '../parsing/slugify'
import { saveResult } from '../storage/tempStorage'
import { getJob, updateJob } from './jobStore'
import type { Job, JobOptions } from './types'

/** Minimum delay between requests to the source site, mirrors DELAY_SECONDS in find_lyrics.py. */
const DELAY_MS = process.env.VITEST ? 0 : 1500

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Processes a job in the background: fetches each song's lyrics, then generates the output document(s). */
export async function runJob(jobId: string, options: JobOptions): Promise<void> {
  updateJob(jobId, { status: 'running' })

  const songs: SongDocument[] = []
  const results: Job['results'] = []

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

    updateJob(jobId, { processed: i + 1, results: [...results] })

    if (i < options.songs.length - 1) {
      await sleep(DELAY_MS)
    }
  }

  if (songs.length === 0) {
    updateJob(jobId, { status: 'error', error: 'Nenhuma música encontrada.' })
    return
  }

  try {
    const { filename, contentType, data } = await buildOutput(jobId, songs, options)
    saveResult(jobId, filename, contentType, data)
    updateJob(jobId, { status: 'done', downloadFilename: filename })
  } catch (err) {
    updateJob(jobId, { status: 'error', error: err instanceof Error ? err.message : 'Erro desconhecido' })
  }
}

async function buildOutput(jobId: string, songs: SongDocument[], options: JobOptions) {
  const job = getJob(jobId)
  const baseName = job ? `repertorio-${job.id.slice(0, 8)}` : 'repertorio'

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
