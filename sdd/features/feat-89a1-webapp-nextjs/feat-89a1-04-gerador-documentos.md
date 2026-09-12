# feat-89a1-04-gerador-documentos

**Branch:** `feat/webapp-nextjs`
**Fase:** 1
**Depende de:** feat-89a1-01-setup-nextjs
**Status:** `done`

## Objetivo
Portar para TypeScript a geração de documentos individuais e mesclados (`generate_docx`/`generate_combined_docx`/`generate_pdf`/`generate_combined_pdf`), preservando o layout atual: título 20pt negrito centralizado, artista 13pt itálico centralizado, divisória, corpo da letra; PDF em 2 colunas com numeração de página no rodapé; DOCX com quebra de página entre músicas.

## Critério de conclusão
```bash
npm test -- docgen
```

## Tarefas
- [x] **89a1-04-1** Geração DOCX (lib `docx`) — individual e mesclado
- [x] **89a1-04-2** Geração PDF (lib `pdf-lib` ou `pdfkit`) — individual e mesclado, layout 2 colunas
- [x] **89a1-04-3** Testes visuais/estruturais comparando saída com os documentos gerados pelo `find_lyrics.py` original

## Arquivos gerados
```
lib/docgen/generateDocx.ts
lib/docgen/generatePdf.ts
lib/docgen/docgen.test.ts
```

## Skills relevantes
(consultar `skills/index.md`)
