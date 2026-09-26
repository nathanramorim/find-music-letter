import { NextResponse } from 'next/server'
import { buildOutput } from '@/lib/docgen/buildOutput'
import type { SongDocument } from '@/lib/docgen/types'

export const runtime = 'nodejs'
export const maxDuration = 60

interface GenerateBody {
  songs: SongDocument[]
  format: 'docx' | 'pdf'
  mode: 'merged' | 'separate'
}

function isSong(value: unknown): value is SongDocument {
  const s = value as SongDocument
  return !!s && typeof s.title === 'string' && typeof s.lyrics === 'string' && typeof s.artist === 'string'
}

/** Builds the document from lyrics already fetched by the client and returns the file directly. */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Partial<GenerateBody>

  if (!Array.isArray(body.songs) || body.songs.length === 0 || !body.songs.every(isSong)) {
    return NextResponse.json({ error: 'Nenhuma letra para gerar o documento.' }, { status: 400 })
  }
  if (body.format !== 'docx' && body.format !== 'pdf') {
    return NextResponse.json({ error: 'format deve ser "docx" ou "pdf"' }, { status: 400 })
  }
  if (body.mode !== 'merged' && body.mode !== 'separate') {
    return NextResponse.json({ error: 'mode deve ser "merged" ou "separate"' }, { status: 400 })
  }

  const { filename, contentType, data } = await buildOutput(body.songs, body.format, body.mode)

  return new NextResponse(new Uint8Array(data), {
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
