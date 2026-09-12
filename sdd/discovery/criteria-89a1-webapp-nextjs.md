# criteria-89a1-webapp-nextjs

## Restrições
- **Stack alvo:** Next.js (App Router) + TypeScript. Sem runtime Python — toda a lógica hoje em `find_lyrics.py` precisa ser portada para TS.
- **Deploy serverless (ex: Vercel):** funções serverless têm timeout curto. Como o fluxo atual usa `DELAY_SECONDS = 1.5s` entre requisições (para não sobrecarregar o letras.mus.br), uma lista de N músicas pode levar bem mais que o limite de uma função síncrona. O processamento precisa rodar como job assíncrono, com a UI consultando progresso (polling ou streaming), não como request-response direto.
- **Bypass anti-bot:** o script atual usa `curl_cffi` com impersonation de TLS fingerprint (`impersonate="chrome124"`) para contornar Cloudflare. Bibliotecas Node não replicam TLS fingerprinting da mesma forma — a reescrita deve usar headers HTTP realistas e o fallback de busca (equivalente ao `ddgs`) como mitigação. Risco de taxa de bloqueio diferente do script Python deve ser aceito e monitorado, não é um "mesmo funcionamento" garantido bit-a-bit.
- **Parsing do arquivo de entrada:** manter exatamente o formato hoje aceito — `Artista - Música` por linha, linhas vazias e iniciadas com `#` ignoradas, linha sem `" - "` tratada como apenas título (artista descoberto via busca).
- **Layout dos documentos:** manter o layout visual atual — título (20pt, negrito, centralizado), artista (13pt, itálico, centralizado), divisória, corpo da letra; PDF em 2 colunas com numeração de página no rodapé; DOCX com quebra de página entre músicas.

## Critérios de aceitação (executáveis)
1. Upload de `.txt` no formato atual **ou** colar lista na textarea é aceito e parseado de forma idêntica (mesmas regras de `#`, linha vazia, `Artista - Música` vs. apenas título).
2. Usuário escolhe o formato de saída (PDF ou DOCX) via interface antes de iniciar o processamento.
3. Usuário escolhe o modo de saída via interface: arquivo único mesclado (todas as músicas, quebra de página entre elas) ou arquivos separados (download em lote/zip).
4. O processamento roda de forma assíncrona (job em background), com feedback de progresso na UI (ex: "3/10 músicas processadas") sem estourar timeout de função serverless.
5. Ao concluir, a UI disponibiliza link(s) de download do(s) documento(s) gerado(s).
6. Falha ao encontrar uma música específica não interrompe o processamento das demais; o resultado final lista quais músicas falharam (equivalente ao `[NÃO ENCONTRADO]` do CLI).
7. O intervalo mínimo entre requisições ao site de origem é preservado na versão web.

## C4 Model — Contexto

```mermaid
C4Context
    title Contexto — find-music-letter webapp

    Person(usuario, "Usuário final", "Líder de louvor, catequista, organizador de repertório")
    System(webapp, "find-music-letter (webapp)", "Next.js — busca letras e gera PDF/DOCX")
    System_Ext(letras, "letras.mus.br", "Fonte das letras de música")
    System_Ext(busca, "Motor de busca (fallback)", "Localiza a URL da letra quando busca direta falha")

    Rel(usuario, webapp, "Envia lista de músicas, escolhe formato/modo, baixa documentos")
    Rel(webapp, letras, "Busca e extrai letras (HTTP)")
    Rel(webapp, busca, "Fallback de busca quando bloqueado")
```

## C4 Model — Containers

```mermaid
C4Container
    title Containers — find-music-letter webapp

    Person(usuario, "Usuário final")

    System_Boundary(webapp, "find-music-letter (Next.js)") {
        Container(ui, "Frontend", "Next.js / React", "Upload/textarea de músicas, escolha de formato e modo, acompanhamento de progresso, download")
        Container(api, "API Routes", "Next.js Route Handlers (TS)", "Recebe lista, dispara job de processamento, expõe status")
        Container(worker, "Job de processamento", "TS (background/queue)", "Busca letras com delay entre requisições, gera documentos")
        Container(docgen, "Gerador de documentos", "TS (docx / pdf-lib)", "Monta DOCX/PDF individual ou mesclado")
        ContainerDb(storage, "Storage temporário", "Blob/arquivo temporário", "Guarda documentos gerados para download")
    }

    System_Ext(letras, "letras.mus.br")
    System_Ext(busca, "Motor de busca (fallback)")

    Rel(usuario, ui, "Usa a interface", "HTTPS")
    Rel(ui, api, "Envia lista / consulta progresso", "HTTPS/JSON")
    Rel(api, worker, "Dispara/consulta job")
    Rel(worker, letras, "Busca e extrai letra", "HTTPS")
    Rel(worker, busca, "Fallback de busca", "HTTPS")
    Rel(worker, docgen, "Envia dados da música")
    Rel(docgen, storage, "Salva documento gerado")
    Rel(ui, storage, "Baixa documento", "HTTPS")
```
