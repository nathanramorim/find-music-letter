# Lições Aprendidas — forge-sdd

Padrões de erro já corrigidos, consultados por Builder/Revisor antes de implementar (lido no READ-MIN, feat-01-04). Entradas mais recentes primeiro; o arquivo é aparado automaticamente para respeitar o orçamento.

- Título de resultado do fallback DuckDuckGo às vezes vem no formato 'Música - Artista - LETRAS.MUS.BR' (3 partes), não só 'Música - Artista'; pegar o último segmento como artista captura o nome do site. → Filtrar segmentos que casem com o nome do site (ex: 'letras.mus.br', case-insensitive) antes de escolher o primeiro/último segmento como música/artista. (sdd/features/feat-89a1-webapp-nextjs/feat-89a1-03-motor-busca.md)
