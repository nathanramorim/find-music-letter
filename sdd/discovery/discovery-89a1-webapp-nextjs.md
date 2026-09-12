# discovery-89a1-webapp-nextjs

## Contexto atual
O projeto hoje é um script CLI em Python (`find_lyrics.py`) que busca letras no letras.mus.br a partir de um arquivo `.txt` (`Artista - Música` por linha) e gera documentos DOCX ou PDF, individuais ou mesclados em um único arquivo.

## Porquê
Uso via CLI exige terminal, instalação de dependências Python (`uv`/`pip`) e edição manual de arquivo texto. Isso limita o uso a quem já sabe rodar scripts — na prática, uma pessoa técnica roda o script para os demais (ex: ministros de louvor, catequistas, organizadores de repertório de eventos). Um webapp remove essa dependência: qualquer pessoa acessa uma URL, informa as músicas e baixa o resultado.

## Para quem
Usuários finais não-técnicos que hoje pedem a um terceiro para gerar as letras — líderes de louvor, catequistas, organizadores de repertório — e que precisam do documento pronto (PDF ou DOCX) para impressão ou edição.

## Como (macro)
Webapp Next.js com:
1. **Entrada das músicas** — upload de arquivo `.txt` no mesmo formato atual, ou colar a lista diretamente em uma textarea na interface.
2. **Escolha de saída via interface** — formato (PDF ou DOCX) e modo (arquivo único mesclado, com todas as músicas, ou arquivos separados — um por música).
3. **Mesmo funcionamento de busca** — busca a letra no letras.mus.br (com fallback de busca quando bloqueado), preservando o intervalo entre requisições para não sobrecarregar o site de origem, e reportando individualmente quando uma música não é encontrada.
4. **Entrega** — usuário baixa o(s) documento(s) gerado(s) ao final do processamento.

## Decisões de arquitetura confirmadas com o usuário
| Decisão | Resolução |
|---------|-----------|
| Entrada de músicas | Upload de `.txt` **+** textarea para colar/editar a lista na própria interface |
| Lógica de busca/scraping (hoje em Python: `curl_cffi`, `BeautifulSoup`, `ddgs`) | Reescrita em TypeScript/Node nas API routes do Next.js — sem dependência de runtime Python |
| Geração de documentos (hoje `python-docx` + `fpdf2`) | Reescrita com libs Node (`docx` para Word, `pdf-lib`/`pdfkit` para PDF), replicando o layout atual |
| Ambiente de execução | Serverless (ex: Vercel) — implica processamento assíncrono (job em background) para não estourar o timeout de função serverless em listas longas |

Detalhamento técnico e critérios de aceitação em `criteria-89a1-webapp-nextjs.md`.
