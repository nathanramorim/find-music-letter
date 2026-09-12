'use client'

import type { Job } from '@/lib/jobs/types'

interface ProgressViewProps {
  job: Job
}

export function ProgressView({ job }: ProgressViewProps) {
  const percent = job.total > 0 ? Math.round((job.processed / job.total) * 100) : 0

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-muted">
        {job.processed}/{job.total} música(s) processada(s)
      </p>
      <div className="h-2 w-full overflow-hidden rounded-full bg-border">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      {job.results.length > 0 && (
        <ul className="mt-2 flex flex-col gap-1 text-sm">
          {job.results.map((result, i) => (
            <li key={i} className={result.ok ? 'text-emerald-700 dark:text-emerald-400' : 'text-primary'}>
              {result.ok ? '✓' : '✗'} {result.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
