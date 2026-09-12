# Progress — find-music-letter

## Status
```
Fase 0 — Foundation          [ ] todo
Fase 1/2 — webapp-nextjs     [x] done (7/7 features)
```

## Features ativas
| Feature | Branch | Status |
|---------|--------|--------|
| feat-00-foundation | feat/foundation | todo |
| feat-89a1-webapp-nextjs (89a1-01..07) | feat/webapp-nextjs | done |

## Próximo passo
**Iniciar:** revisão (`/revisar`) do webapp em `web/` antes de merge; depois considerar feat-00-foundation
**Bloqueios:** —

## Handoff da última sessão
- Webapp Next.js criado em `web/` (App Router + TS), porta completa do CLI Python: parsing, busca (letras.mus.br + fallback DuckDuckGo), geração DOCX/PDF, job assíncrono, opções de saída, download+zip
- Build, lint, typecheck e testes (15) passam; fluxo validado ponta-a-ponta contra o site real
- Limitação conhecida: storage/job store em memória (não sobrevive a múltiplas instâncias serverless) — ver criteria-89a1
- Design aplicado (paleta quente, tipografia serifada nos títulos) + seção "Por que esse app existe" na home, contando a motivação pessoal (esposa cantora de casamentos)

## Última sessão

> Histórico completo em `progress-log.md`
