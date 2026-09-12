import { describe, expect, it } from 'vitest'
import { generateCombinedDocx, generateDocx } from './generateDocx'
import { generateCombinedPdf, generatePdf } from './generatePdf'
import type { SongDocument } from './types'

const song: SongDocument = {
  artist: 'Legião Urbana',
  title: 'Tempo Perdido',
  lyrics: 'Todos os dias quando acordo\nNão tenho mais o tempo que passou\n\nMas tenho muito tempo',
}

const song2: SongDocument = {
  artist: 'Titãs',
  title: 'Epitáfio',
  lyrics: 'Eu não devia estar aqui\nEu queria estar em casa',
}

describe('generateDocx', () => {
  it('produces a valid docx (zip) buffer', async () => {
    const buffer = await generateDocx(song)
    expect(buffer.subarray(0, 2).toString()).toBe('PK')
    expect(buffer.length).toBeGreaterThan(0)
  })

  it('combines multiple songs into a single docx', async () => {
    const buffer = await generateCombinedDocx([song, song2])
    expect(buffer.subarray(0, 2).toString()).toBe('PK')
  })
})

describe('generatePdf', () => {
  it('produces a valid pdf buffer', async () => {
    const buffer = await generatePdf(song)
    expect(buffer.subarray(0, 4).toString()).toBe('%PDF')
  })

  it('combines multiple songs into a single pdf', async () => {
    const buffer = await generateCombinedPdf([song, song2])
    expect(buffer.subarray(0, 4).toString()).toBe('%PDF')
  })
})
