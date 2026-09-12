# Overview — find-music-letter

Busca letras de música e gera documentos DOCX/PDF prontos pra estudar ou imprimir. Existe como script CLI (Python, raiz do repo) e como webapp (Next.js, `web/`) — o webapp é a porta ativa, pensada pra quem precisa montar repertório sem rodar comando (ex: cantores que aprendem música nova pra cada apresentação).

## Índice
- `stack.md` — tecnologias
- `modules.md` — componentes
- `flows.md` — fluxos principais
- `decisions.md` — decisões de design

---

## Arquitetura (C4 Model)

### Nível 1: Contexto

```mermaid
C4Context
    title Contexto — find-music-letter

    Person(usuario, "Usuário", "Quer letra(s) de música em DOCX/PDF")
    System(webapp, "find-music-letter (webapp)", "Next.js — usado via navegador")
    System(cli, "find_lyrics.py (CLI)", "Python — usado via terminal")
    System_Ext(letras, "letras.mus.br", "Fonte das letras + API de busca (solr.sscdn.co)")
    System_Ext(fallback, "DuckDuckGo / Bing", "Fallback de busca quando a API do site não encontra a música")

    Rel(usuario, webapp, "Cola lista de músicas, escolhe formato/modo, baixa documento", "HTTPS")
    Rel(usuario, cli, "Roda com arquivo .txt de músicas")
    Rel(webapp, letras, "Busca (Solr) + extrai letra (print.html)", "HTTPS")
    Rel(cli, letras, "Busca + extrai letra", "HTTPS")
    Rel(webapp, fallback, "Fallback de busca")
    Rel(cli, fallback, "Fallback de busca (ddgs)")
```

### Nível 2: Containers (Webapp)

```mermaid
C4Container
    title Containers — find-music-letter webapp

    Person(usuario, "Usuário")

    System_Boundary(webapp, "find-music-letter (Next.js, web/)") {
        Container(ui, "Frontend", "React / Next.js App Router", "Input de músicas, opções de formato/modo, download")
        Container(api, "API Route", "Next.js Route Handler (POST /api/jobs)", "Processa tudo de forma síncrona numa única requisição")
        Container(scraper, "lib/scraper", "TypeScript", "searchSong (Solr + fallback DDG/Bing), fetchLyrics")
        Container(docgen, "lib/docgen", "TypeScript (docx, pdf-lib)", "Gera DOCX/PDF individual ou mesclado")
    }

    System_Ext(solr, "solr.sscdn.co", "API de busca instantânea do letras.mus.br")
    System_Ext(letras, "letras.mus.br", "Página de impressão da letra")
    System_Ext(fallback, "DuckDuckGo / Bing")

    Rel(usuario, ui, "Usa a interface", "HTTPS")
    Rel(ui, api, "POST songsText + formato + modo", "HTTPS/JSON")
    Rel(api, scraper, "Busca cada música")
    Rel(scraper, solr, "Busca primária", "HTTPS")
    Rel(scraper, letras, "Extrai letra (print.html)", "HTTPS")
    Rel(scraper, fallback, "Fallback se Solr não encontra")
    Rel(api, docgen, "Gera o(s) documento(s)")
    Rel(api, ui, "Devolve arquivo em base64 na resposta")
```
