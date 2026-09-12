# Constituição — find-music-letter

## Missão
Buscar letras de música e gerar documentos (DOCX/PDF) prontos pra estudar ou imprimir, disponível como script CLI (Python) e como webapp (Next.js).

## Stack
| Camada | Escolha | Motivo |
|--------|---------|--------|
| Runtime (CLI, raiz do repo) | Python 3 + uv | Script original `find_lyrics.py`; `uv` gerencia venv/deps (`pyproject.toml`, `uv.lock`) |
| Runtime (Webapp, `web/`) | Next.js 16 (App Router) + TypeScript, Node.js | Porta do CLI para uso via navegador (feat-89a1-webapp-nextjs) |
| DB | none | Sem persistência — cada requisição do webapp processa e devolve o resultado na hora |
| Deploy (Webapp) | Vercel | `vercel --prod` a partir de `web/`; projeto `find-music-letter` na conta do usuário |
| Config | `web/.env.local` (gerado pelo `vercel link`), `sdd/.sddrc` (config do Forge-SDD) | |
| Secrets | Nenhum segredo/API key em uso hoje (busca via API pública, sem chave) | |

## Decisões resolvidas
| Decisão | Resolução |
|---------|-----------|
| Busca de letras (webapp) | API pública de busca instantânea do próprio site (`solr.sscdn.co/letras/m1/`), não scraping de motor de busca — `/busca/?q=` do site foi descontinuado e DuckDuckGo/Bing bloqueiam IP de datacenter |
| Estado entre requisições (webapp) | Nenhum — busca + geração do documento rodam de forma síncrona numa única requisição (`POST /api/jobs`), evitando depender de estado compartilhado entre invocações serverless da Vercel |
| Armazenamento de arquivo gerado | Não há storage — o documento volta em base64 na própria resposta do POST e é baixado no navegador via Blob |

## Ferramentas e Integrações
| Campo | Valor |
|-------|-------|
| VCS / Work Item System | github (`gh` CLI autenticado; remoto `nathanramorim/find-music-letter`) |
| Deploy | Vercel (`vercel` CLI autenticado; projeto `find-music-letter`) |

Consulte `sdd/memory/mcps.md` para o status real de cada MCP configurado (`ativo`/`indisponível`) antes de assumir que ele responde. Se "VCS / Work Item System" for `azure-devops`, use `az repos pr create` (ou instrução equivalente documentada) em vez de `gh pr create`. Se `nenhum`, deixe a branch pronta e informe o usuário, sem tentar nenhum comando de VCS.

## Regras (máx. 10)
1. Sem commits diretos em main
2. Branch por feature
3. Config centralizado em `sdd/.sddrc` (Forge-SDD) e `web/.env.local` (webapp)
4. Secrets em `.env`/`.env.local` (nunca commit) — hoje o webapp não usa nenhum
5. Antes de usar lib externa, consultar context7 com versão exata — desde que `sdd/memory/mcps.md` o liste como `ativo`; se `indisponível`, usar a documentação oficial da lib
6. Toda feature tem critério executável
7. Feature quebrada em subpasta (`sdd/features/<prefixo>-ID-<nome>/`) usa uma única branch agrupando todas as subtarefas — nunca uma branch por subtarefa. Antes de criar a branch, pergunte a branch de partida (default `main`) e verifique (`git branch --list <prefixo>/ID-*`) se já existe uma branch da mesma feature/fix a retomar.
8. Idioma do chat: pt-BR
9. Idioma de commits e PRs (título e descrição): pt-BR
10. Nível de Linguagem: padrão (jargão técnico normal, sem simplificação)
