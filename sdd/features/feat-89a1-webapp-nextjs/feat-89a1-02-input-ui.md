# feat-89a1-02-input-ui

**Branch:** `feat/webapp-nextjs`
**Fase:** 1
**Depende de:** feat-89a1-01-setup-nextjs
**Status:** `done`

## Objetivo
Tela de entrada de músicas: upload de arquivo `.txt` e textarea para colar/editar a lista, com parsing e validação idênticos ao formato hoje aceito pelo CLI (`Artista - Música`, linhas `#` e vazias ignoradas, linha só com título).

## Critério de conclusão
```bash
npm test -- input-parsing
```

## Tarefas
- [x] **89a1-02-1** Componente de upload de `.txt`
- [x] **89a1-02-2** Componente de textarea (colar/editar lista)
- [x] **89a1-02-3** Parser TS (`parseSongsFile`) replicando regras de `parse_songs_file` do CLI
- [x] **89a1-02-4** Validação e feedback de erros de formato na UI

## Arquivos gerados
```
app/components/SongInput.tsx
lib/parsing/parseSongs.ts
lib/parsing/parseSongs.test.ts
```

## Skills relevantes
(consultar `skills/index.md`)
