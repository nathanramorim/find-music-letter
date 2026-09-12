'use client'

import type { JobResultEntry } from '@/lib/jobs/types'

interface DownloadResultProps {
  url: string
  filename: string
  results: JobResultEntry[]
}

export function DownloadResult({ url, filename, results }: DownloadResultProps) {
  const failed = results.filter((r) => !r.ok)

  return (
    <div className="flex flex-col gap-3">
      <a
        href={url}
        download={filename}
        className="w-fit rounded-full bg-accent px-5 py-2 text-sm font-medium text-white hover:brightness-95"
      >
        Baixar {filename}
      </a>

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
