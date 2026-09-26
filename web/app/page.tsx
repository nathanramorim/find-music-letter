'use client'

import { useEffect, useRef, useState } from 'react'
import { SongInput } from './components/SongInput'
import { OutputOptions } from './components/OutputOptions'
import { ProgressView } from './components/ProgressView'
import { DownloadResult } from './components/DownloadResult'
import { parseSongsText } from '@/lib/parsing/parseSongs'
import type { SongDocument } from '@/lib/docgen/types'
import type { Job, OutputFormat, OutputMode } from '@/lib/jobs/types'

/** Minimum delay between songs, to avoid hammering the source site (mirrors DELAY_SECONDS in find_lyrics.py). */
const DELAY_MS = 1500

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function filenameFromResponse(res: Response, fallback: string) {
  const match = res.headers.get('Content-Disposition')?.match(/filename="([^"]+)"/)
  return match?.[1] ?? fallback
}

export default function Home() {
  const [songsText, setSongsText] = useState('')
  const [format, setFormat] = useState<OutputFormat>('docx')
  const [mode, setMode] = useState<OutputMode>('merged')
  const [job, setJob] = useState<Job | null>(null)
  const [error, setError] = useState<string | null>(null)
  const downloadUrlRef = useRef<string | null>(null)

  const isRunning = job?.status === 'running'

  useEffect(() => {
    return () => {
      if (downloadUrlRef.current) URL.revokeObjectURL(downloadUrlRef.current)
    }
  }, [])

  function update(patch: Partial<Job>) {
    setJob((current) => (current ? { ...current, ...patch } : current))
  }

  async function handleSubmit() {
    setError(null)
    if (downloadUrlRef.current) {
      URL.revokeObjectURL(downloadUrlRef.current)
      downloadUrlRef.current = null
    }

    const requests = parseSongsText(songsText)
    if (requests.length === 0) {
      setError('Nenhuma música válida encontrada no texto enviado.')
      return
    }

    setJob({
      status: 'running',
      total: requests.length,
      processed: 0,
      results: [],
      downloadUrl: null,
      downloadFilename: null,
      error: null,
    })

    const found: SongDocument[] = []
    const results: Job['results'] = []

    for (let i = 0; i < requests.length; i++) {
      const { artist, song } = requests[i]
      const label = artist ? `${artist} - ${song}` : song

      let ok = false
      try {
        const res = await fetch('/api/lyrics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ artist, song }),
        })
        if (res.ok) {
          const body = (await res.json()) as { found: SongDocument | null }
          if (body.found) {
            found.push(body.found)
            ok = true
          }
        }
      } catch {
        // network error: counted as not found
      }

      results.push({ label, ok })
      update({ processed: i + 1, results: [...results] })

      if (i < requests.length - 1) await sleep(DELAY_MS)
    }

    if (found.length === 0) {
      update({ status: 'error', error: 'Nenhuma música encontrada.' })
      return
    }

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ songs: found, format, mode }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        update({ status: 'error', error: body.error ?? 'Falha ao gerar o documento.' })
        return
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      downloadUrlRef.current = url
      const fallback = mode === 'merged' ? `repertorio.${format}` : 'repertorio.zip'
      update({ status: 'done', downloadUrl: url, downloadFilename: filenameFromResponse(res, fallback) })
    } catch {
      update({ status: 'error', error: 'Falha ao gerar o documento.' })
    }
  }

  return (
    <div className="flex flex-col items-center">
      <header className="w-full border-b border-border bg-surface/60">
        <div className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-4 sm:px-6 sm:py-5">
          <span className="flex items-center gap-2 font-display text-base italic text-primary sm:text-lg">
            ♪ find-music-letter
          </span>
          <a href="#sobre" className="text-xs text-muted hover:text-foreground sm:text-sm">
            Por que esse app existe
          </a>
        </div>
      </header>

      <main className="flex w-full max-w-3xl flex-col gap-8 px-4 py-8 sm:gap-10 sm:px-6 sm:py-14">
        <section className="flex flex-col gap-3 text-center sm:text-left">
          <h1 className="font-display text-3xl italic tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Letras prontas pra cantar
          </h1>
          <p className="text-base text-muted">
            Cole sua lista de músicas, escolha o formato e o modo de saída. A gente busca as
            letras e monta o documento, pronto pra estudar ou imprimir.
          </p>
        </section>

        <section className="flex flex-col gap-6 rounded-2xl border border-border bg-surface p-4 shadow-sm sm:gap-7 sm:p-8">
          <SongInput value={songsText} onChange={setSongsText} disabled={isRunning} />

          <OutputOptions
            format={format}
            mode={mode}
            onFormatChange={setFormat}
            onModeChange={setMode}
            disabled={isRunning}
          />

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isRunning || songsText.trim().length === 0}
            className="w-full rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50 sm:w-fit"
          >
            {isRunning ? 'Processando…' : 'Buscar letras'}
          </button>

          {error && <p className="text-sm text-primary">{error}</p>}

          {job && <ProgressView job={job} />}
          {job && (job.status === 'done' || job.status === 'error') && <DownloadResult job={job} />}
        </section>

        <section
          id="sobre"
          className="flex flex-col gap-4 rounded-2xl border border-border bg-surface/60 p-4 sm:p-8"
        >
          <h2 className="font-display text-xl italic text-primary sm:text-2xl">Por que esse app existe</h2>
          <div className="flex flex-col gap-4 text-sm leading-relaxed text-foreground/90 sm:text-[15px]">
            <p>
              Minha esposa é cantora e canta em casamentos, o que significa aprender letras
              novas o tempo todo. A cada cerimônia é um repertório diferente: a música da
              entrada, a dos pais, as da festa. Toda vez era a mesma rotina manual: procurar
              cada letra numa aba, copiar, colar, formatar, imprimir, pra ela conseguir estudar
              e levar tudo organizado no dia da cerimônia.
            </p>
            <p>
              Criei esse app pra resolver exatamente isso: você cola a lista de músicas, escolhe
              se quer um repertório único ou os arquivos separados, em PDF ou Word, e a
              ferramenta busca as letras e já entrega os documentos prontos, sem ter que caçar
              site por site antes de cada casamento.
            </p>
            <p className="text-sm text-muted">Feito com carinho para quem vive de música.</p>
          </div>
        </section>
      </main>

      <footer className="w-full border-t border-border py-6 text-center text-xs text-muted">
        find-music-letter · feito com carinho para quem vive de música.
      </footer>
    </div>
  )
}
