# Stack — find-music-letter

O repositório tem dois runtimes coexistindo: o CLI Python original (raiz) e o webapp Next.js (`web/`), que é a porta ativa em desenvolvimento (feat-89a1-webapp-nextjs).

## Dependências — CLI (raiz)

| Camada | Escolha | Versão | Motivo |
|--------|---------|--------|--------|
| Runtime | Python | 3.x (ver `pyproject.toml`) | Script original `find_lyrics.py` |
| Gerenciador de pacotes | uv | — | `uv.lock` / `uv sync` |
| HTTP | curl_cffi | — | Impersonation de TLS/Chrome pra tentar contornar bloqueio anti-bot |
| Parsing HTML | BeautifulSoup4 | — | Extração da letra da página de impressão |
| Busca fallback | ddgs | — | Fallback via DuckDuckGo quando a busca direta falha |
| Geração DOCX | python-docx | — | |
| Geração PDF | fpdf2 | — | Layout 2 colunas |
| Slug | unidecode | — | Normalização de nomes de arquivo |

## Dependências — Webapp (`web/`)

| Camada | Escolha | Versão | Motivo |
|--------|---------|--------|--------|
| Framework | Next.js | 16.x (App Router, Turbopack) | |
| Linguagem | TypeScript | 5.x | |
| UI | React 19 + Tailwind CSS 4 | | Fonte de exibição `Geist` (UI) + `Fraunces` (display/itálico) |
| HTTP (server-side) | `fetch` nativo do Node | | Sem lib de scraping externa |
| Parsing HTML | cheerio | | Fallbacks DuckDuckGo/Bing |
| Busca primária | API pública `solr.sscdn.co/letras/m1/` | | Mesma API que alimenta a busca instantânea do site — sem bloqueio anti-bot |
| Geração DOCX | `docx` (npm) | | |
| Geração PDF | `pdf-lib` | | Layout 2 colunas replicado do CLI |
| Zip (modo separado) | `jszip` | | |
| Testes | Vitest | | `npm test` |
| Deploy | Vercel | | `vercel --prod` a partir de `web/` |

`web/.npmrc` fixa `legacy-peer-deps=true` (conflito de peer dependency entre `vitest` e `docx` em `@types/node`).

## Layout do projeto
```
find_lyrics.py            # CLI original (Python)
musicas.txt / musicas.example.txt
requirements.txt, pyproject.toml, uv.lock

web/                       # Webapp Next.js (porta ativa)
  app/
    page.tsx                       # UI: input, opções, resultado
    components/                    # SongInput, OutputOptions, DownloadResult
    api/jobs/route.ts              # POST síncrono: busca + gera documento, devolve base64
  lib/
    parsing/                       # parseSongsText, slugify
    scraper/                       # searchSong (Solr + fallback DDG/Bing), fetchLyrics, http
    docgen/                        # generateDocx, generatePdf
    jobs/                          # processSongs (orquestra busca + geração)

sdd/                        # Framework Forge-SDD (discovery, features, memory)
.agents/, .claude/, .gemini/  # Configuração dos agentes de IA
```
