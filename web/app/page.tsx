'use client'

import { useState } from 'react'
import { SongInput } from './components/SongInput'
import { OutputOptions } from './components/OutputOptions'
import { DownloadResult } from './components/DownloadResult'
import type { JobResultEntry, OutputFormat, OutputMode } from '@/lib/jobs/types'

interface JobResponse {
  filename: string
  contentType: string
  data: string
  results: JobResultEntry[]
}

export default function Home() {
  const [songsText, setSongsText] = useState('')
  const [format, setFormat] = useState<OutputFormat>('docx')
  const [mode, setMode] = useState<OutputMode>('merged')
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ url: string; filename: string; results: JobResultEntry[] } | null>(
    null
  )

  async function handleSubmit() {
    setError(null)
    setResult(null)
    setIsRunning(true)

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ songsText, format, mode }),
      })

      const body = await res.json().catch(() => ({ error: 'Falha ao processar as músicas.' }))

      if (!res.ok) {
        setError(body.error ?? 'Falha ao processar as músicas.')
        return
      }

      const { filename, contentType, data, results } = body as JobResponse
      const bytes = Uint8Array.from(atob(data), (c) => c.charCodeAt(0))
      const blob = new Blob([bytes], { type: contentType })
      setResult({ url: URL.createObjectURL(blob), filename, results })
    } finally {
      setIsRunning(false)
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

          {isRunning && (
            <p className="text-sm text-muted">
              Buscando as letras e montando o documento. Isso pode levar alguns segundos, um
              pouquinho mais por música.
            </p>
          )}

          {error && <p className="text-sm text-primary">{error}</p>}

          {result && <DownloadResult url={result.url} filename={result.filename} results={result.results} />}
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
            <p className="font-display italic text-primary">
              Essa é uma homenagem pra minha esposa, Carolina. Te amo, Carolina{' '}
              <span aria-hidden>♡</span>
            </p>
            <p className="text-sm text-muted">
              Feito por{' '}
              <a
                href="https://instagram.com/nathan.ramorim"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary"
              >
                @nathan.ramorim
              </a>{' '}
              para{' '}
              <a
                href="https://instagram.com/carolinasantanamorim"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary"
              >
                @carolinasantanamorim
              </a>
              , com carinho para quem vive de música.
            </p>
          </div>
        </section>
      </main>

      <footer className="w-full border-t border-border py-6 text-center text-xs text-muted">
        find-music-letter · feito com carinho para quem vive de música
      </footer>
    </div>
  )
}
