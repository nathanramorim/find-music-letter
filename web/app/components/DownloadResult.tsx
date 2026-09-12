'use client'

import type { Job } from '@/lib/jobs/types'

interface DownloadResultProps {
  job: Job
}

export function DownloadResult({ job }: DownloadResultProps) {
  const failed = job.results.filter((r) => !r.ok)

  return (
    <div className="flex flex-col gap-3">
      {job.status === 'done' && job.downloadFilename && (
        <a
          href={`/api/jobs/${job.id}/download`}
          className="w-fit rounded-full bg-accent px-5 py-2 text-sm font-medium text-white hover:brightness-95"
        >
          Baixar {job.downloadFilename}
        </a>
      )}

      {job.status === 'error' && <p className="text-sm text-primary">Erro: {job.error}</p>}

      {failed.length > 0 && (
        <div className="text-sm text-muted">
          <p className="font-medium text-foreground">Não encontradas ({failed.length}):</p>
          <ul className="list-inside list-disc">
            {failed.map((r, i) => (
              <li key={i}>{r.label}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
