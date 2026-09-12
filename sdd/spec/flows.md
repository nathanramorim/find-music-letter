# Fluxos — find-music-letter

## Fluxo principal (webapp)

```
[usuário cola/sobe lista de músicas + escolhe formato/modo]
  ↓
[POST /api/jobs]
  ↓
[parseSongsText] → lista de {artista, música}
  ↓
para cada música (sequencial, com delay entre requisições):
  [searchSong] → API Solr do site → (fallback DuckDuckGo → Bing se não achar)
  ↓
  [fetchLyrics] → resolve URL real, extrai letra da página de impressão
  ↓
[gera documento] → DOCX ou PDF, mesclado ou zip separado
  ↓
[resposta] → { filename, contentType, data (base64), results (achadas/não achadas) }
  ↓
[browser] → decodifica base64 em Blob → link de download
```

## Fluxo do CLI (`find_lyrics.py`, raiz)

```
[arquivo .txt com lista de músicas]
  ↓
[parse_songs_file]
  ↓
para cada música: [search_song] (letras.mus.br → fallback ddgs) → [fetch_lyrics]
  ↓
[generate_docx / generate_pdf] (individual ou --single mesclado)
  ↓
[arquivos salvos em ./letras/]
```
