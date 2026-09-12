# feat-89a1-05-job-assincrono

**Branch:** `feat/webapp-nextjs`
**Fase:** 2
**Depende de:** feat-89a1-03-motor-busca, feat-89a1-04-gerador-documentos
**Status:** `done`

## Objetivo
Orquestrar o processamento (busca + geração de documentos) como job em background, respeitando o intervalo mínimo entre requisições ao site de origem (equivalente a `DELAY_SECONDS`), com endpoint de status para a UI acompanhar o progresso sem estourar o timeout de função serverless.

## Critério de conclusão
```bash
npm test -- job-processing
```

## Tarefas
- [x] **89a1-05-1** Endpoint que recebe a lista e dispara o job (`POST /api/jobs`)
- [x] **89a1-05-2** Worker que processa músicas sequencialmente com delay mínimo entre requisições
- [x] **89a1-05-3** Endpoint de status/progresso (`GET /api/jobs/:id`)
- [x] **89a1-05-4** Tratamento de falha por música sem interromper o job (equivalente ao `[NÃO ENCONTRADO]` do CLI)

## Arquivos gerados
```
app/api/jobs/route.ts
app/api/jobs/[id]/route.ts
lib/jobs/processJob.ts
```

## Skills relevantes
(consultar `skills/index.md`)
