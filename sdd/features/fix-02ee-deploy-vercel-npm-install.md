# fix-02ee-deploy-vercel-npm-install

**Branch:** `feat/webapp-nextjs`
**Depende de:** feat-89a1-01-setup-nextjs
**Status:** `done`

## Bug
Primeiro `vercel --prod` falhava no build: `Command "npm install" exited with 1`.

## Causa raiz
Conflito de peer dependency: `vitest@5` exige `@types/node` `^22 || >=24`, mas o `@types/node` instalado pela raiz do projeto (`^20`) e o `@types/node` aninhado do `docx` colidiam. Funcionava localmente porque o `node_modules` já tinha sido resolvido antes com `--legacy-peer-deps`; o build limpo da Vercel roda `npm install` sem esse flag.

## Correção aplicada
Adicionado `web/.npmrc` com `legacy-peer-deps=true`, e regenerado `package-lock.json` a partir de um `node_modules` limpo.

## Critério de conclusão
```bash
cd web && rm -rf node_modules package-lock.json && npm install && npm run build
```

## Arquivos alterados
```
web/.npmrc
web/package-lock.json
```

## Commit
`73010c0` — Fix Vercel deploy: pin legacy-peer-deps for npm install
