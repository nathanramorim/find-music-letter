import { randomUUID } from 'crypto'
import type { Job, JobOptions } from './types'

const jobs = new Map<string, Job>()

export function createJob(options: JobOptions): Job {
  const job: Job = {
    id: randomUUID(),
    status: 'pending',
    total: options.songs.length,
    processed: 0,
    results: [],
    downloadFilename: null,
    error: null,
  }
  jobs.set(job.id, job)
  return job
}

export function getJob(id: string): Job | null {
  return jobs.get(id) ?? null
}

export function updateJob(id: string, patch: Partial<Job>): void {
  const job = jobs.get(id)
  if (!job) return
  jobs.set(id, { ...job, ...patch })
}
