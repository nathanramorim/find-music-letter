# feat-89a1-03-motor-busca

**Branch:** `feat/webapp-nextjs`
**Fase:** 1
**Depende de:** feat-89a1-01-setup-nextjs
**Status:** `done`

## Objetivo
Portar para TypeScript a lógica de busca e extração de letras hoje em `find_lyrics.py` (`search_song`, `fetch_lyrics`): busca direta no letras.mus.br, extração via página de impressão, e fallback de busca quando bloqueado. Maior incerteza técnica do plano — pode exigir spike antes de fechar o escopo (ver `sdd/discovery/plan-89a1-webapp-nextjs.md`).

## Critério de conclusão
```bash
npm test -- lyrics-search
```

## Tarefas
- [x] **89a1-03-1** Cliente HTTP com headers realistas (equivalente ao `curl_cffi` impersonation, na medida do possível em Node)
- [x] **89a1-03-2** Busca direta no letras.mus.br + parsing HTML (cheerio) equivalente a `_search_via_letras`
- [x] **89a1-03-3** Extração da letra via página de impressão (`page-header`, `page-container`) equivalente a `fetch_lyrics`
- [x] **89a1-03-4** Fallback de busca equivalente a `_search_via_duckduckgo`
- [x] **89a1-03-5** Spike/validação: taxa de bloqueio Cloudflare em produção vs. script Python original

## Arquivos gerados
```
lib/scraper/searchSong.ts
lib/scraper/fetchLyrics.ts
lib/scraper/searchSong.test.ts
```

## Skills relevantes
(consultar `skills/index.md`)
