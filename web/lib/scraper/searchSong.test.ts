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

  it('resolves via the Solr instant-search API (letras.mus.br own search backend)', async () => {
    const solrBody = JSON.stringify({
      response: {
        docs: [
          { art: 'Titãs', dns: 'titas', txt: 'Epitáfio', t: '2', url: 'epitafio' },
          { art: 'Titãs', dns: 'titas', txt: 'Epitáfio (Ao Vivo)', t: '3', url: 'epitafio-ao-vivo' },
        ],
      },
    })

    const fetchMock = vi.fn().mockResolvedValueOnce(new Response(`LetrasSug(${solrBody})`, { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    const result = await searchSong('Titãs Epitáfio')
    expect(result).toEqual({
      artistName: 'Titãs',
      songName: 'Epitáfio',
      fullUrl: 'https://www.letras.mus.br/titas/epitafio/',
    })
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('prefers a Solr doc matching the artist hint over the top-scored doc', async () => {
    const solrBody = JSON.stringify({
      response: {
        docs: [
          { art: 'Outra Banda', dns: 'outra-banda', txt: 'Eu e Minha Casa', t: '2', url: 'eu-e-minha-casa' },
          { art: 'Juliany Souza', dns: 'juliany-souza', txt: 'Eu e Minha Casa', t: '2', url: '999' },
        ],
      },
    })

    const fetchMock = vi.fn().mockResolvedValueOnce(new Response(`LetrasSug(${solrBody})`, { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    const result = await searchSong('Juliany Souza Eu e Minha Casa', 'Juliany Souza')
    expect(result).toEqual({
      artistName: 'Juliany Souza',
      songName: 'Eu e Minha Casa',
      fullUrl: 'https://www.letras.mus.br/juliany-souza/999/',
    })
  })

  it('retries fuzzy when the exact query only finds a different artist (typo in the hint)', async () => {
    // Real case: user typed "Juliany Souza" but the site has it as "Julliany Souza" (double L).
    const exactBody = JSON.stringify({
      response: {
        docs: [{ art: 'André e Felipe', dns: 'andre-e-felipe', txt: 'A Sós', t: '2', url: 'a-sos' }],
      },
    })
    const fuzzyBody = JSON.stringify({
      response: {
        docs: [{ art: 'Julliany Souza', dns: 'julliany-souza', txt: 'Eu e Minha Casa', t: '2', url: '999' }],
      },
    })

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(`LetrasSug(${exactBody})`, { status: 200 }))
      .mockResolvedValueOnce(new Response(`LetrasSug(${fuzzyBody})`, { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    const result = await searchSong('Juliany Souza Eu e Minha Casa', 'Juliany Souza')
    expect(result).toEqual({
      artistName: 'Julliany Souza',
      songName: 'Eu e Minha Casa',
      fullUrl: 'https://www.letras.mus.br/julliany-souza/999/',
    })
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('retries Solr with fuzzy terms, then falls back to DuckDuckGo when both find nothing', async () => {
    const fetchMock = vi
      .fn()
      // Solr, exact query: no song docs
      .mockResolvedValueOnce(new Response('LetrasSug({"response":{"docs":[]}})', { status: 200 }))
      // Solr, fuzzy retry: still nothing
      .mockResolvedValueOnce(new Response('LetrasSug({"response":{"docs":[]}})', { status: 200 }))
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
    expect(fetchMock).toHaveBeenCalledTimes(3)
  })

  it('finds a typo-tolerant match via the fuzzy Solr retry', async () => {
    const solrBody = JSON.stringify({
      response: { docs: [{ art: 'Laura Souguellis', dns: 'laura-souguellis', txt: 'Santo Espírito', t: '2', url: '1' }] },
    })

    const fetchMock = vi
      .fn()
      // exact query ("Souguelis", missing one "l"): nothing
      .mockResolvedValueOnce(new Response('LetrasSug({"response":{"docs":[]}})', { status: 200 }))
      // fuzzy retry: finds it
      .mockResolvedValueOnce(new Response(`LetrasSug(${solrBody})`, { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    const result = await searchSong('Santo Espírito Laura Souguelis')
    expect(result).toEqual({
      artistName: 'Laura Souguellis',
      songName: 'Santo Espírito',
      fullUrl: 'https://www.letras.mus.br/laura-souguellis/1/',
    })
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('falls back to Bing when Solr (exact + fuzzy) and DuckDuckGo find nothing', async () => {
    const bingHref =
      'https://www.bing.com/ck/a?u=a1' +
      Buffer.from('https://www.letras.mus.br/titas/epitafio/').toString('base64url')

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('LetrasSug({"response":{"docs":[]}})', { status: 200 }))
      .mockResolvedValueOnce(new Response('LetrasSug({"response":{"docs":[]}})', { status: 200 }))
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
    expect(fetchMock).toHaveBeenCalledTimes(4)
  })
})
