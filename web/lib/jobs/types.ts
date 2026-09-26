export type OutputFormat = 'docx' | 'pdf'
export type OutputMode = 'merged' | 'separate'

export interface JobResultEntry {
  label: string
  ok: boolean
}

export type JobStatus = 'running' | 'done' | 'error'

/** Client-side progress of a lyrics search + document generation run. */
export interface Job {
  status: JobStatus
  total: number
  processed: number
  results: JobResultEntry[]
  downloadUrl: string | null
  downloadFilename: string | null
  error: string | null
}
