import { describe, expect, it } from 'vitest'
import { parseSongsText } from './parseSongs'

describe('parseSongsText', () => {
  it('parses "Artista - Música" lines', () => {
    expect(parseSongsText('Legião Urbana - Tempo Perdido')).toEqual([
      { artist: 'Legião Urbana', song: 'Tempo Perdido' },
    ])
  })

  it('treats a line without " - " as title-only', () => {
    expect(parseSongsText('Bohemian Rhapsody')).toEqual([{ artist: null, song: 'Bohemian Rhapsody' }])
  })

  it('ignores blank lines and comments', () => {
    const input = ['# playlist', '', 'Titãs - Epitáfio', '   ', '# outro comentário'].join('\n')
    expect(parseSongsText(input)).toEqual([{ artist: 'Titãs', song: 'Epitáfio' }])
  })

  it('trims whitespace around artist and song', () => {
    expect(parseSongsText('  Chico Buarque   -   Construção  ')).toEqual([
      { artist: 'Chico Buarque', song: 'Construção' },
    ])
  })

  it('returns an empty list for empty input', () => {
    expect(parseSongsText('')).toEqual([])
  })
})
