# feat-89a1-06-opcoes-saida

**Branch:** `feat/webapp-nextjs`
**Fase:** 2
**Depende de:** feat-89a1-02-input-ui, feat-89a1-05-job-assincrono

**Status:** `done`

## Objetivo
Interface para o usuário escolher o formato de saída (PDF ou DOCX) e o modo de saída (arquivo único mesclado ou arquivos separados) antes de iniciar o processamento, integrando essas escolhas ao job assíncrono, além da tela de acompanhamento de progresso.

## Critério de conclusão
```bash
npm test -- output-options
```

## Tarefas
- [x] **89a1-06-1** Seletor de formato (PDF/DOCX) na UI
- [x] **89a1-06-2** Seletor de modo (mesclado/separado) na UI
- [x] **89a1-06-3** Tela de progresso (ex: "3/10 músicas processadas") consumindo o endpoint de status

## Arquivos gerados
```
app/components/OutputOptions.tsx
app/components/ProgressView.tsx
```

## Skills relevantes
(consultar `skills/index.md`)
