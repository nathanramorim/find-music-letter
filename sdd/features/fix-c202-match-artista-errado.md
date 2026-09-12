# fix-c202-match-artista-errado

**Branch:** `feat/webapp-nextjs`
**Depende de:** fix-c388-busca-letras-quebrada
**Status:** `done`

## Bug
Reportado pelo usuário: "Eu e Minha Casa - Juliany Souza" retornava a letra errada — uma música completamente diferente ("A Sós", de outro artista que apenas cita "Juliany Souza" como participação).

## Causa raiz
O ranking de relevância do Solr é por texto completo, não por correspondência exata de artista+música — pode colocar na frente uma música de mesmo título (ou termos parecidos) de outro artista. O código pegava sempre o primeiro resultado, sem checar se o artista batia com o informado pelo usuário.

## Correção aplicada
Quando o artista é conhecido, a busca passa a preferir, entre os resultados de música, o primeiro cujo campo `art` do Solr realmente contém o artista informado (comparação normalizada via `slugify`), em vez de aceitar cegamente o resultado de maior score.

## Critério de conclusão
```bash
npm test -- searchSong
```

## Arquivos alterados
```
web/lib/scraper/searchSong.ts
web/lib/scraper/fetchLyrics.ts
web/lib/scraper/searchSong.test.ts
```

## Commit
`f0ccf5a` — Priorizar match de artista na busca via Solr

## Observação
Esse fix sozinho não cobre o caso em que o nome do artista tem erro de digitação (ver fix-ac6a) — resolvido numa segunda rodada depois que o usuário reportou o mesmo tipo de erro de novo.
