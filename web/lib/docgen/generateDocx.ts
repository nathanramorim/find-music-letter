import {
  AlignmentType,
  BorderStyle,
  Document,
  PageBreak,
  Packer,
  Paragraph,
  TextRun,
} from 'docx'
import type { SongDocument } from './types'

const TITLE_COLOR = '1E1E1E'
const ARTIST_COLOR = '505050'
const LYRICS_COLOR = '282828'
const DIVIDER_COLOR = 'C8C8C8'

function buildSongParagraphs(song: SongDocument, isLast: boolean): Paragraph[] {
  const paragraphs: Paragraph[] = []

  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: song.title, bold: true, size: 40, color: TITLE_COLOR }),
      ],
    })
  )

  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: song.artist, italics: true, size: 26, color: ARTIST_COLOR }),
      ],
    })
  )

  paragraphs.push(
    new Paragraph({
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 12, space: 1, color: DIVIDER_COLOR },
      },
      children: [],
    })
  )

  for (const line of song.lyrics.split('\n')) {
    if (line.trim()) {
      paragraphs.push(
        new Paragraph({
          spacing: { line: 276 },
          children: [new TextRun({ text: line, size: 20, color: LYRICS_COLOR })],
        })
      )
    } else {
      paragraphs.push(new Paragraph({}))
    }
  }

  if (!isLast) {
    paragraphs.push(new Paragraph({ children: [new PageBreak()] }))
  }

  return paragraphs
}

/** Generates a single DOCX document for one song. */
export async function generateDocx(song: SongDocument): Promise<Buffer> {
  return generateCombinedDocx([song])
}

/** Generates a single DOCX containing all songs, each starting on a new page. */
export async function generateCombinedDocx(songs: SongDocument[]): Promise<Buffer> {
  const children = songs.flatMap((song, i) => buildSongParagraphs(song, i === songs.length - 1))

  const doc = new Document({
    sections: [{ children }],
  })

  return Packer.toBuffer(doc)
}
