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
   ├─ 89a1-07-download-falhas    (depende de 89a1-05, 89a1-06)
   ├─ fix-02ee-deploy-vercel-npm-install    (depende de 89a1-01)
   ├─ fix-75cd-job-404-intermitente         (depende de 89a1-05, 89a1-07)
   ├─ fix-c388-busca-letras-quebrada        (depende de 89a1-03)
   ├─ fix-c202-match-artista-errado         (depende de fix-c388)
   └─ fix-ac6a-typo-tolerance-fuzzy         (depende de fix-c202)
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
| fix-02ee | fix-02ee-deploy-vercel-npm-install.md | feat/webapp-nextjs | pós-deploy | done |
| fix-75cd | fix-75cd-job-404-intermitente.md | feat/webapp-nextjs | pós-deploy | done |
| fix-c388 | fix-c388-busca-letras-quebrada.md | feat/webapp-nextjs | pós-deploy | done |
| fix-c202 | fix-c202-match-artista-errado.md | feat/webapp-nextjs | pós-deploy | done |
| fix-ac6a | fix-ac6a-typo-tolerance-fuzzy.md | feat/webapp-nextjs | pós-deploy | done |
