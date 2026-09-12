# fix-75cd-job-404-intermitente

**Branch:** `feat/webapp-nextjs`
**Depende de:** feat-89a1-05-job-assincrono, feat-89a1-07-download-falhas
**Status:** `done`

## Bug
Reportado pelo usuário em produção: muitos erros 404 no console do navegador, e o polling de status do job às vezes retornava `{"error":"Job não encontrado"}` de forma aleatória, mesmo logo após criar o job.

## Causa raiz
O job e o arquivo gerado ficavam guardados em memória (`Map` por processo, em `lib/jobs/jobStore.ts` / `lib/storage/tempStorage.ts`). A Vercel roda cada requisição numa invocação serverless sem garantir a mesma instância entre chamadas: o `POST /api/jobs` criava o job numa instância, e o `GET /api/jobs/:id` do polling podia cair numa instância diferente, sem aquele estado — daí o 404 intermitente. Funcionava sempre em dev local porque ali só existe um processo.

## Correção aplicada
Removida toda a arquitetura de job assíncrono + polling + storage em memória. Agora `POST /api/jobs` processa tudo de forma síncrona (busca de cada música + geração do documento) dentro da própria requisição e devolve o arquivo pronto em base64 na resposta (`maxDuration = 60`). O frontend decodifica o base64 em um `Blob` e oferece o link de download direto, sem polling. Removidos `app/api/jobs/[id]/*`, `lib/jobs/jobStore.ts`, `lib/storage/tempStorage.ts`, `app/components/ProgressView.tsx`.

## Critério de conclusão
```bash
curl -X POST https://find-music-letter-nathan-amorims-projects.vercel.app/api/jobs \
  -H "Content-Type: application/json" \
  -d '{"songsText":"Zeca Pagodinho - Deixa a Vida me Levar","format":"docx","mode":"merged"}'
# repetir 3x seguidas: sempre 200, nunca "Job não encontrado"
```

## Arquivos alterados
```
web/app/api/jobs/route.ts
web/app/api/jobs/[id]/route.ts (removido)
web/app/api/jobs/[id]/download/route.ts (removido)
web/app/components/DownloadResult.tsx
web/app/components/ProgressView.tsx (removido)
web/app/page.tsx
web/lib/jobs/jobStore.ts (removido)
web/lib/jobs/processJob.ts
web/lib/jobs/types.ts
web/lib/storage/tempStorage.ts (removido)
```

## Commit
`5774ebe` — Corrigir 404 intermitente em produção: eliminar job/storage em memória

## Lição
Registrada em `sdd/memory/lessons.md`: job/storage em memória por processo não é confiável em rotas serverless multi-instância; processar tudo numa única requisição síncrona elimina a necessidade de estado compartilhado.
