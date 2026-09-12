'use client'

import type { OutputFormat, OutputMode } from '@/lib/jobs/types'

interface OutputOptionsProps {
  format: OutputFormat
  mode: OutputMode
  onFormatChange: (format: OutputFormat) => void
  onModeChange: (mode: OutputMode) => void
  disabled?: boolean
}

export function OutputOptions({
  format,
  mode,
  onFormatChange,
  onModeChange,
  disabled,
}: OutputOptionsProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:gap-10">
      <fieldset className="flex flex-col gap-2" disabled={disabled}>
        <legend className="text-sm font-medium">Formato de saída</legend>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="format"
            className="accent-primary"
            checked={format === 'docx'}
            onChange={() => onFormatChange('docx')}
          />
          DOCX (Word)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="format"
            className="accent-primary"
            checked={format === 'pdf'}
            onChange={() => onFormatChange('pdf')}
          />
          PDF
        </label>
      </fieldset>

      <fieldset className="flex flex-col gap-2" disabled={disabled}>
        <legend className="text-sm font-medium">Modo de saída</legend>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="mode"
            className="accent-primary"
            checked={mode === 'merged'}
            onChange={() => onModeChange('merged')}
          />
          Arquivo único mesclado
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="mode"
            className="accent-primary"
            checked={mode === 'separate'}
            onChange={() => onModeChange('separate')}
          />
          Arquivos separados (.zip)
        </label>
      </fieldset>
    </div>
  )
}
