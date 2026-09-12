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

export type JobStatus = 'pending' | 'running' | 'done' | 'error'

export interface Job {
  id: string
  status: JobStatus
  total: number
  processed: number
  results: JobResultEntry[]
  downloadFilename: string | null
  error: string | null
}
