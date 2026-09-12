# Index de Features — find-music-letter

## Dependency graph

```
main
├─ feat/foundation
└─ feat/webapp-nextjs
   ├─ 89a1-01-setup-nextjs
   ├─ 89a1-02-input-ui           (depende de 89a1-01)
   ├─ 89a1-03-motor-busca        (depende de 89a1-01)
   ├─ 89a1-04-gerador-documentos (depende de 89a1-01)
   ├─ 89a1-05-job-assincrono     (depende de 89a1-03, 89a1-04)
   ├─ 89a1-06-opcoes-saida       (depende de 89a1-02, 89a1-05)
   └─ 89a1-07-download-falhas    (depende de 89a1-05, 89a1-06)
```

## Índice

| # | Arquivo | Branch | Fase | Status |
|---|---------|--------|------|--------|
| 00 | feat-00-foundation.md | feat/foundation | 0 | todo |
| 89a1-01 | feat-89a1-webapp-nextjs/feat-89a1-01-setup-nextjs.md | feat/webapp-nextjs | 1 | done |
| 89a1-02 | feat-89a1-webapp-nextjs/feat-89a1-02-input-ui.md | feat/webapp-nextjs | 1 | done |
| 89a1-03 | feat-89a1-webapp-nextjs/feat-89a1-03-motor-busca.md | feat/webapp-nextjs | 1 | done |
| 89a1-04 | feat-89a1-webapp-nextjs/feat-89a1-04-gerador-documentos.md | feat/webapp-nextjs | 1 | done |
| 89a1-05 | feat-89a1-webapp-nextjs/feat-89a1-05-job-assincrono.md | feat/webapp-nextjs | 2 | done |
| 89a1-06 | feat-89a1-webapp-nextjs/feat-89a1-06-opcoes-saida.md | feat/webapp-nextjs | 2 | done |
| 89a1-07 | feat-89a1-webapp-nextjs/feat-89a1-07-download-falhas.md | feat/webapp-nextjs | 2 | done |
