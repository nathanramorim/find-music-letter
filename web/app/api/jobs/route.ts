import { NextResponse } from 'next/server'
import { parseSongsText } from '@/lib/parsing/parseSongs'
import { createJob } from '@/lib/jobs/jobStore'
import { runJob } from '@/lib/jobs/processJob'
import type { OutputFormat, OutputMode } from '@/lib/jobs/types'

export const runtime = 'nodejs'

interface CreateJobBody {
  songsText: string
  format: OutputFormat
  mode: OutputMode
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<CreateJobBody>

  if (!body.songsText || typeof body.songsText !== 'string') {
    return NextResponse.json({ error: 'songsText é obrigatório' }, { status: 400 })
  }
  if (body.format !== 'docx' && body.format !== 'pdf') {
    return NextResponse.json({ error: 'format deve ser "docx" ou "pdf"' }, { status: 400 })
  }
  if (body.mode !== 'merged' && body.mode !== 'separate') {
    return NextResponse.json({ error: 'mode deve ser "merged" ou "separate"' }, { status: 400 })
  }

  const songs = parseSongsText(body.songsText)
  if (songs.length === 0) {
    return NextResponse.json({ error: 'Nenhuma música válida encontrada no texto enviado.' }, { status: 400 })
  }

  const job = createJob({ songs, format: body.format, mode: body.mode })

  // Fire-and-forget: the job runs in the background while the client polls /api/jobs/:id.
  void runJob(job.id, { songs, format: body.format, mode: body.mode })

  return NextResponse.json({ id: job.id }, { status: 201 })
}
