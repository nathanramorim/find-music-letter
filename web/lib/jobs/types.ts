import type { SongRequest } from '../parsing/parseSongs'

export type OutputFormat = 'docx' | 'pdf'
export type OutputMode = 'merged' | 'separate'

export interface JobOptions {
  songs: SongRequest[]
  format: OutputFormat
  mode: OutputMode
}

export interface JobResultEntry {
  label: string
  ok: boolean
}

export interface ProcessResult {
  filename: string
  contentType: string
  data: Buffer
  results: JobResultEntry[]
}
