import JSZip from 'jszip'
import { generateCombinedDocx, generateDocx } from './generateDocx'
import { generateCombinedPdf, generatePdf } from './generatePdf'
import type { SongDocument } from './types'
import { slugify } from '../parsing/slugify'
import type { OutputFormat, OutputMode } from '../jobs/types'

export interface BuiltOutput {
  filename: string
  contentType: string
  data: Buffer
}

/** Generates the final document: one merged file, or a zip with one file per song. */
export async function buildOutput(
  songs: SongDocument[],
  format: OutputFormat,
  mode: OutputMode
): Promise<BuiltOutput> {
  const baseName = 'repertorio'

  if (mode === 'merged') {
    const data = format === 'docx' ? await generateCombinedDocx(songs) : await generateCombinedPdf(songs)
    const contentType =
      format === 'docx'
        ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        : 'application/pdf'
    return { filename: `${baseName}.${format}`, contentType, data }
  }

  const zip = new JSZip()
  for (const song of songs) {
    const data = format === 'docx' ? await generateDocx(song) : await generatePdf(song)
    const filename = `${slugify(song.artist || 'desconhecido')}-${slugify(song.title)}.${format}`
    zip.file(filename, data)
  }
  const zipData = await zip.generateAsync({ type: 'nodebuffer' })
  return { filename: `${baseName}.zip`, contentType: 'application/zip', data: zipData }
}
