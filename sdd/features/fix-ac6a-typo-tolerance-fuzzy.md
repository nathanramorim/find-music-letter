# fix-ac6a-typo-tolerance-fuzzy

**Branch:** `feat/webapp-nextjs`
**Depende de:** fix-c202-match-artista-errado
**Status:** `done`

## Bug
Dois problemas reportados pelo usuário, mesma causa raiz:
1. "Santo Espírito - Laura Souguelis" e "1000 Graus - Renascer Prise" não eram encontradas.
2. "Eu e Minha Casa - Juliany Souza" continuava vindo errado ("A Sós") mesmo depois do fix-c202.

## Causa raiz
Erro de digitação de uma letra no nome do artista (`Souguelis` → `Souguellis`; `Prise` → `Praise`; `Juliany` → `Julliany`). A query exata do Solr é tokenizada e não tolera esse tipo de erro:
- Quando **nenhum** doc batia com a query exata (`Souguelis`, `Prise`), a busca retornava vazio → "não encontrada".
- Quando a query exata **ainda encontrava algo** — só que de outro artista, por coincidência de termos (`Juliany`/`Julliany Souza` → "A Sós") — o fix-c202 aceitava esse resultado errado sem nunca tentar uma alternativa, porque só entrava em fallback quando a lista vinha **vazia**, não quando vinha com o artista errado.

## Correção aplicada
Duas mudanças em `searchViaSolr`:
1. Adicionado um retry com o operador fuzzy do Lucene (`~1`, uma edição de tolerância) em cada palavra de 4+ letras da query, usado quando a busca exata não encontra nada.
2. Quando o artista é conhecido, o retry fuzzy agora também dispara se a busca exata encontrou uma música, mas de um artista **diferente** do informado — não só quando não encontrou nada.

## Critério de conclusão
```bash
npm test -- searchSong
curl -X POST http://localhost:3060/api/jobs -H "Content-Type: application/json" \
  -d '{"songsText":"Santo Espírito - Laura Souguelis\n1000 Graus - Renascer Prise\nEu e Minha Casa - Juliany Souza","format":"docx","mode":"separate"}'
# todas "ok": true, com artista/letra corretos
```

## Arquivos alterados
```
web/lib/scraper/searchSong.ts
web/lib/scraper/searchSong.test.ts
```

## Commits
`cc08e9a` — Tolerar erro de digitação na busca (retry fuzzy no Solr)
`a3552f2` — Tentar fuzzy também quando o artista não bate (não só quando nada é encontrado)
