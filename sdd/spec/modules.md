# Módulos — find-music-letter

## `web/app` — UI + API
**Responsabilidade:** interface do usuário e o único endpoint HTTP do webapp.

- [x] `page.tsx` — formulário (input, formato, modo), estado de loading, download do resultado
- [x] `components/SongInput.tsx` — upload de `.txt` + textarea
- [x] `components/OutputOptions.tsx` — seleção de formato (DOCX/PDF) e modo (mesclado/separado)
- [x] `components/DownloadResult.tsx` — link de download + lista de músicas não encontradas
- [x] `api/jobs/route.ts` — `POST` síncrono: parseia, busca, gera documento, devolve base64

## `web/lib/parsing` — Entrada
**Responsabilidade:** interpretar o texto de músicas no mesmo formato do CLI.

- [x] `parseSongs.ts` — `Artista - Música` por linha, `#`/linha vazia ignorados
- [x] `slugify.ts` — nome de arquivo (usado no modo separado/zip)

## `web/lib/scraper` — Busca e extração de letra
**Responsabilidade:** achar a URL da música e extrair a letra.

- [x] `searchSong.ts` — busca primária via API Solr do site; fallback DuckDuckGo → Bing
- [x] `fetchLyrics.ts` — resolve URL real + extrai letra da página de impressão (`page-header`/`page-container`)
- [x] `http.ts` — fetch com headers realistas (best-effort, sem impersonation TLS real)
- [x] `extractLetrasUrl.ts` — parse de href do letras.mus.br (slug ou ID numérico)

## `web/lib/docgen` — Geração de documento
**Responsabilidade:** montar DOCX/PDF replicando o layout do CLI original.

- [x] `generateDocx.ts` — individual e mesclado
- [x] `generatePdf.ts` — individual e mesclado, layout 2 colunas + rodapé

## `web/lib/jobs` — Orquestração
**Responsabilidade:** rodar busca + geração para a lista inteira de músicas.

- [x] `processJob.ts` (`processSongs`) — sequencial, com delay entre requisições; monta zip quando modo separado
- [x] `types.ts` — `JobOptions`, `ProcessResult`, etc.

## `find_lyrics.py` (raiz) — CLI original
**Responsabilidade:** mesma funcionalidade via linha de comando, referência de comportamento pro webapp. Não recebeu as correções de busca aplicadas ao webapp (endpoint `/busca/?q=` do site mudou/quebrou, ver `sdd/memory/lessons.md`).
