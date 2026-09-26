import { afterEach, describe, expect, it, vi } from 'vitest'
import { extractLetrasUrlFromHref } from './extractLetrasUrl'
import { parseSuggestResponse, searchSong } from './searchSong'

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

  it('resolves the song via the letras.mus.br suggest API', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(
      new Response(
        'LetrasSug({"response":{"docs":[{"dns":"anjos-de-resgate","art":"Anjos de Resgate","t":"1"},' +
          '{"dns":"anjos-de-resgate","url":"o-primeiro-olhar","txt":"O Primeiro Olhar","art":"Anjos de Resgate","t":"2"}]}})',
        { status: 200 }
      )
    )
    vi.stubGlobal('fetch', fetchMock)

    const result = await searchSong('O primeiro olhar Anjos de resgate')
    expect(result).toEqual({
      artistName: 'Anjos de Resgate',
      songName: 'O Primeiro Olhar',
      fullUrl: 'https://www.letras.mus.br/anjos-de-resgate/o-primeiro-olhar/',
    })
    expect(String(fetchMock.mock.calls[0][0])).toContain('solr.sscdn.co/letras/m1/')
  })

  it('tries alternative queries before falling back', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('LetrasSug({"response":{"docs":[]}})', { status: 200 }))
      .mockResolvedValueOnce(
        new Response(
          'LetrasSug({"response":{"docs":[{"dns":"eliana-ribeiro","url":"chuva-de-graca","txt":"Chuva de Graça","art":"Eliana Ribeiro","t":"2"}]}})',
          { status: 200 }
        )
      )
    vi.stubGlobal('fetch', fetchMock)

    const result = await searchSong('Chuva de graça Eliana Ribeiro', 'Eliana Ribeiro Chuva de graça')
    expect(result?.fullUrl).toBe('https://www.letras.mus.br/eliana-ribeiro/chuva-de-graca/')
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('falls back to DuckDuckGo when the suggest API finds nothing', async () => {
    const fetchMock = vi
      .fn()
      // suggest API blocked (ex: 422)
      .mockResolvedValueOnce(new Response('', { status: 422 }))
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
})

describe('parseSuggestResponse', () => {
  it('ignores non-song docs and malformed bodies', () => {
    expect(parseSuggestResponse('LetrasSug({"response":{"docs":[{"dns":"titas","t":"1"}]}})')).toBeNull()
    expect(parseSuggestResponse('<html>blocked</html>')).toBeNull()
  })
})
