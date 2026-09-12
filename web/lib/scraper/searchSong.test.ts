import { afterEach, describe, expect, it, vi } from 'vitest'
import { extractLetrasUrlFromHref } from './extractLetrasUrl'
import { searchSong } from './searchSong'

describe('extractLetrasUrlFromHref', () => {
  it('extracts artist/song from a numeric-id href', () => {
    const result = extractLetrasUrlFromHref('https://www.letras.mus.br/legiao-urbana-musicas/123456/')
    expect(result).toEqual({
      artistName: 'Legiao Urbana',
      songName: '123456',
      fullUrl: 'https://www.letras.mus.br/legiao-urbana-musicas/123456/',
    })
  })

  it('extracts artist/song from a slug href', () => {
    const result = extractLetrasUrlFromHref('https://www.letras.mus.br/titas/epitafio/')
    expect(result).toEqual({
      artistName: 'Titas',
      songName: 'Epitafio',
      fullUrl: 'https://www.letras.mus.br/titas/epitafio/',
    })
  })

  it('returns null for a non-matching href', () => {
    expect(extractLetrasUrlFromHref('https://example.com/foo')).toBeNull()
  })
})

describe('searchSong', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('falls back to DuckDuckGo when the direct search finds nothing', async () => {
    const fetchMock = vi
      .fn()
      // direct letras.mus.br search: no results
      .mockResolvedValueOnce(new Response('<html><body></body></html>', { status: 200 }))
      // DuckDuckGo fallback: one matching result
      .mockResolvedValueOnce(
        new Response(
          '<html><body><a class="result__a" href="https://www.letras.mus.br/titas/epitafio/">Epitáfio - Titãs</a></body></html>',
          { status: 200 }
        )
      )
    vi.stubGlobal('fetch', fetchMock)

    const result = await searchSong('Titãs Epitáfio')
    expect(result).toEqual({
      artistName: 'Titãs',
      songName: 'Epitáfio',
      fullUrl: 'https://www.letras.mus.br/titas/epitafio/',
    })
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('falls back to Bing when both letras.mus.br and DuckDuckGo find nothing', async () => {
    const bingHref =
      'https://www.bing.com/ck/a?u=a1' +
      Buffer.from('https://www.letras.mus.br/titas/epitafio/').toString('base64url')

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('<html><body></body></html>', { status: 200 }))
      .mockResolvedValueOnce(new Response('<html><body></body></html>', { status: 200 }))
      .mockResolvedValueOnce(
        new Response(
          `<html><body><li class="b_algo"><h2><a href="${bingHref}">Epitáfio - Titãs</a></h2></li></body></html>`,
          { status: 200 }
        )
      )
    vi.stubGlobal('fetch', fetchMock)

    const result = await searchSong('Titãs Epitáfio')
    expect(result).toEqual({
      artistName: 'Titãs',
      songName: 'Epitáfio',
      fullUrl: 'https://www.letras.mus.br/titas/epitafio/',
    })
    expect(fetchMock).toHaveBeenCalledTimes(3)
  })
})
