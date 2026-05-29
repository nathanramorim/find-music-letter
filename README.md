# find-music-letter

Busca letras de músicas no [letras.mus.br](https://www.letras.mus.br/) e gera documentos editáveis em **DOCX (Word)** ou **PDF**.

## Instalação

### Instalação rápida (tudo junto)

**Linux/macOS:**
```bash
python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt
```

**Windows:**
```bash
python3 -m venv venv && venv\Scripts\activate && pip install -r requirements.txt
```

### Passo a passo

```bash
# 1. Criar ambiente virtual
python3 -m venv venv

# 2. Ativar o ambiente virtual
source venv/bin/activate  # Linux/macOS
# ou
venv\Scripts\activate  # Windows

# 3. Instalar dependências
pip install -r requirements.txt
```

## Uso

### Gerar documentos individuais (padrão em DOCX)

```bash
python find_lyrics.py musicas.txt
```

Os arquivos DOCX são salvos em `./letras/` por padrão. Para especificar outro diretório:

```bash
python find_lyrics.py musicas.txt --output ./minha-pasta
```

### Gerar em PDF em vez de DOCX

```bash
python find_lyrics.py musicas.txt --format pdf
```

### Gerar um único documento com todas as músicas

```bash
python find_lyrics.py musicas.txt --single repertorio.docx
```

Isso cria um único DOCX (`repertorio.docx`) com todas as músicas, cada uma começando numa nova página. Funciona com qualquer formato:

```bash
python find_lyrics.py musicas.txt --format pdf --single repertorio.pdf
```

Ou combine `--output` com `--single`:

```bash
python find_lyrics.py musicas.txt --output ./docs --single meu-repertorio.docx
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

Cada documento contém:
- Título da música e nome do artista (em destaque)
- Letra completa com estrofes preservadas
- Formatação limpa

**Em DOCX:** Totalmente editável no Microsoft Word, Google Docs, LibreOffice e outros editores de documentos.

**Em PDF:** Letra em 2 colunas com numeração de páginas no rodapé.
