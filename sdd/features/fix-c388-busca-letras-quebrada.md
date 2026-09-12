# fix-c388-busca-letras-quebrada

**Branch:** `feat/webapp-nextjs`
**Depende de:** feat-89a1-03-motor-busca
**Status:** `done`

## Bug
Em produção (Vercel), praticamente toda busca falhava com `"Nenhuma música encontrada."`, mesmo pra músicas bem conhecidas — incluindo casos que funcionavam rodando localmente.

## Causa raiz
Investigado com uma rota de debug temporária (`app/api/debug`, removida depois de usar) comparando o comportamento local vs. produção:
1. `letras.mus.br/busca/?q=` (busca direta, primeira fonte) foi descontinuado pelo site — retorna 404 pra qualquer consulta, de qualquer IP (não é bloqueio, o endpoint mudou).
2. O fallback DuckDuckGo bloqueia ativamente IP de datacenter (challenge `anomaly.js`, 403/202).
3. O fallback Bing (adicionado como mitigação) respondia 200, mas com uma página de resultados de anúncios genéricos (Google Ads, Yahoo Ads) sem relação com a busca — um bloqueio disfarçado, específico pra IP de datacenter.

## Correção aplicada
Inspecionadas as requisições de rede da própria caixa de busca do site (`www.letras.mus.br`) no navegador: ela chama `https://solr.sscdn.co/letras/m1/?wt=json&q=<query>` — a API pública que alimenta a busca instantânea do site, sem bloqueio anti-bot observado (é infraestrutura própria do site, não um motor de busca de terceiros). Essa API virou a fonte primária de busca; DuckDuckGo e Bing continuam como fallback residual.

## Critério de conclusão
```bash
curl -X POST https://find-music-letter-nathan-amorims-projects.vercel.app/api/jobs \
  -H "Content-Type: application/json" \
  -d '{"songsText":"Legião Urbana - Tempo Perdido\nHallelujah","format":"docx","mode":"merged"}'
# results: todas "ok": true
```

## Arquivos alterados
```
web/lib/scraper/searchSong.ts
web/lib/scraper/searchSong.test.ts
```

## Commit
`f3cc9dd` — Corrigir busca de letras usando a API oficial de busca instantânea do site

## Lição
Registrada em `sdd/memory/lessons.md`: scraping de motor de busca genérico (DuckDuckGo/Bing) a partir de IP de datacenter é estruturalmente não confiável; quando o site-alvo tem uma busca instantânea própria, vale inspecionar as requisições de rede reais da UI dele antes de depender de scraping de terceiros.
