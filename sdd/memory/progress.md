# Progress — find-music-letter

## Status
```
Fase 0 — Foundation          [ ] todo
Fase 1/2 — webapp-nextjs     [x] done (7/7 features)
Pós-deploy — fixes           [x] done (5/5 fixes)
```

## Features ativas
| Feature | Branch | Status |
|---------|--------|--------|
| feat-00-foundation | feat/foundation | todo |
| feat-89a1-webapp-nextjs (89a1-01..07) | feat/webapp-nextjs | done |
| fix-02ee, fix-75cd, fix-c388, fix-c202, fix-ac6a | feat/webapp-nextjs | done |

## Próximo passo
**Iniciar:** revisão (`/revisar`) do webapp em `web/` antes de merge do PR #1; depois considerar feat-00-foundation
**Bloqueios:** —

## Handoff da última sessão
- Webapp Next.js em produção na Vercel (`find-music-letter-nathan-amorims-projects.vercel.app`), PR #1 aberto pra `main`
- 5 fixes pós-deploy (ver `sdd/features/fix-*.md` e `sdd/memory/lessons.md`):
  - fix-02ee: `npm install` falhando no build da Vercel (peer dep conflict) → `.npmrc` legacy-peer-deps
  - fix-75cd: 404 intermitente (job em memória entre invocações serverless) → tudo síncrono numa requisição
  - fix-c388: busca de letras quebrada em produção (site mudou endpoint; DDG/Bing bloqueiam IP de datacenter) → API Solr própria do site
  - fix-c202: match de artista errado no resultado da busca → prioriza doc cujo artista bate
  - fix-ac6a: erro de digitação não tolerado na busca → retry fuzzy (Lucene `~1`)
- Design aplicado (paleta quente, tipografia serifada) + seção "Por que esse app existe" (motivação pessoal) + dedicatória
- Responsividade mobile-first revisada

## Última sessão

> Histórico completo em `progress-log.md`
