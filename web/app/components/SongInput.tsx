'use client'

import { useRef } from 'react'

interface SongInputProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function SongInput({ value, onChange, disabled }: SongInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    const text = await file.text()
    onChange(text)
    event.target.value = ''
  }

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="songs-textarea" className="text-sm font-medium">
        Músicas (uma por linha, formato &quot;Artista - Música&quot;)
      </label>
      <textarea
        id="songs-textarea"
        className="min-h-40 w-full rounded-lg border border-border bg-background p-3 font-mono text-sm focus:border-primary focus:outline-none sm:min-h-48"
        placeholder={'Legião Urbana - Tempo Perdido\nTitãs - Epitáfio\n# comentários são ignorados'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="w-full rounded-full border border-border px-3.5 py-1.5 text-sm hover:border-primary hover:text-primary disabled:opacity-50 sm:w-fit"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
        >
          Carregar arquivo .txt
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt"
          className="hidden"
          onChange={handleFileChange}
          disabled={disabled}
        />
      </div>
    </div>
  )
}
