# find-music-letter

Busca letras de músicas no [letras.mus.br](https://www.letras.mus.br/) e gera um PDF por música.

## Instalação

```bash
pip install -r requirements.txt
```

## Uso

```bash
python find_lyrics.py musicas.txt
```

Os PDFs são salvos em `./letras/` por padrão. Para especificar outro diretório:

```bash
python find_lyrics.py musicas.txt --output ./minha-pasta
```

## Formato do arquivo .txt

Uma música por linha, no formato `Artista - Música`. Linhas em branco e linhas começando com `#` são ignoradas.

```
# minha playlist
Legião Urbana - Tempo Perdido
Titãs - Epitáfio
Chico Buarque - Construção
```

## Saída

Cada PDF contém:
- Título da música e nome do artista
- Letra completa com estrofes preservadas
- Numeração de páginas no rodapé

O nome do arquivo segue o padrão `artista-musica.pdf`.
