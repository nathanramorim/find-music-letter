import { NextResponse } from 'next/server'
import { getResult } from '@/lib/storage/tempStorage'

export const runtime = 'nodejs'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const result = getResult(id)

  if (!result) {
    return NextResponse.json({ error: 'Arquivo não encontrado' }, { status: 404 })
  }

  return new NextResponse(new Uint8Array(result.data), {
    headers: {
      'Content-Type': result.contentType,
      'Content-Disposition': `attachment; filename="${result.filename}"`,
    },
  })
}
