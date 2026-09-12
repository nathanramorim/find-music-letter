# Decisões — find-music-letter

## Resolvidas

| # | Decisão | Resolução | Motivo |
|---|---------|-----------|--------|
| D1 | Entrada de músicas no webapp | Upload de `.txt` + textarea | Preserva o fluxo do CLI e permite colar direto |
| D2 | Reescrever scraping/geração de docs em TS ou reaproveitar Python | Reescrever em TypeScript, 100% dentro do Next.js | Sem depender de runtime Python em produção |
| D3 | Ambiente de execução do webapp | Serverless (Vercel) | Escolha do usuário no discovery |
| D4 | Estado entre requisições (busca assíncrona com progresso) | Removido — tudo roda síncrono numa única requisição | Vercel não garante a mesma instância entre requisições; job em memória causava 404 intermitente |
| D5 | Fonte de busca primária | API pública `solr.sscdn.co/letras/m1/` (mesma da busca instantânea do site) | `/busca/?q=` do site foi descontinuado; DuckDuckGo/Bing bloqueiam IP de datacenter |
| D6 | Storage do documento gerado | Nenhum — devolvido em base64 na resposta do POST | Sem infra externa disponível; elimina dependência de estado compartilhado |

## Abertas

| # | Questão |
|---|---------|
| D7 | Vale a pena portar a correção de busca (D5) de volta pro CLI Python (`find_lyrics.py`), já que o endpoint que ele usa também quebrou? |
| D8 | Repertórios grandes (muitas músicas) podem se aproximar do limite de `maxDuration` (60s) da função serverless — vale paginar/dividir em lotes? |
