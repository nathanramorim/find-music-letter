import JSZip from 'jszip'
import { describe, expect, it } from 'vitest'
import { buildOutput } from './buildOutput'

const songs = [
  { artist: 'Gabriela Rocha', title: 'Lugar Secreto', lyrics: 'Linha 1\nLinha 2' },
  { artist: 'Isaías Saad', title: 'Bondade de Deus', lyrics: 'Linha 1\n\nLinha 2' },
]

describe('buildOutput', () => {
  it('builds a single merged file', async () => {
    const result = await buildOutput(songs, 'pdf', 'merged')
    expect(result.filename).toBe('repertorio.pdf')
    expect(result.contentType).toBe('application/pdf')
    expect(result.data.length).toBeGreaterThan(0)
  })

  it('builds a zip with one file per song', async () => {
    const result = await buildOutput(songs, 'docx', 'separate')
    expect(result.filename).toBe('repertorio.zip')
    const zip = await JSZip.loadAsync(result.data)
    expect(Object.keys(zip.files).sort()).toEqual([
      'gabriela-rocha-lugar-secreto.docx',
      'isaias-saad-bondade-de-deus.docx',
    ])
  })
})
