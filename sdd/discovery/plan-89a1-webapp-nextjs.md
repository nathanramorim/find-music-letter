# plan-89a1-webapp-nextjs

## Roadmap preliminar

| # | Feature | Objetivo | Tamanho |
|---|---------|----------|---------|
| 01 | Setup Next.js | Scaffold Next.js + TypeScript, estrutura de pastas, deploy configurado (ex: Vercel) | P |
| 02 | Input UI | Upload de `.txt` + textarea, parsing da lista de músicas (mesmas regras do CLI), validação | P |
| 03 | Motor de busca (TS) | Porta de `search_song`/`fetch_lyrics` para TypeScript: busca direta no letras.mus.br, extração da letra via página de impressão, fallback de busca | G |
| 04 | Gerador de documentos (TS) | Porta de `generate_docx`/`generate_pdf` (individual e mesclado) usando libs Node, preservando layout atual | M |
| 05 | Job assíncrono + progresso | Orquestração do processamento em background (fila/job), delay entre requisições, endpoint de status, UI de progresso | M |
| 06 | Opções de saída na UI | Escolha de formato (PDF/DOCX) e modo (mesclado/separado com download em zip) integrados ao fluxo | P |
| 07 | Download e tratamento de falhas | Disponibilização dos arquivos gerados, relatório de músicas não encontradas, storage temporário | P |

## Observações de estimativa
- **03 (motor de busca)** é a maior incerteza técnica: depende de quão bem headers HTTP puros em Node contornam o mesmo bloqueio que hoje o `curl_cffi` (TLS impersonation) contorna. Pode exigir spike técnico antes de fechar o escopo.
- **05 (job assíncrono)** é obrigatório dado o ambiente serverless escolhido — sem ele, listas longas de música estouram o timeout da função.

## Próximo passo
Rodar `/split-features`, organizando as features acima em `sdd/features/feat-89a1-webapp-nextjs/`, agrupadas numa única branch (ex: `feat/webapp-nextjs`).
