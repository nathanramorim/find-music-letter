import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb } from 'pdf-lib'
import type { SongDocument } from './types'

const MARGIN = 56 // ~20mm in points
const PAGE_WIDTH = 595.28 // A4 portrait, points
const PAGE_HEIGHT = 841.89
const COL_GAP = 17 // ~6mm
const LINE_H = 15.6 // ~5.5mm
const GAP_H = 8.5 // ~3mm blank line between stanzas

const TITLE_COLOR = rgb(30 / 255, 30 / 255, 30 / 255)
const ARTIST_COLOR = rgb(80 / 255, 80 / 255, 80 / 255)
const LYRICS_COLOR = rgb(40 / 255, 40 / 255, 40 / 255)
const DIVIDER_COLOR = rgb(200 / 255, 200 / 255, 200 / 255)
const FOOTER_COLOR = rgb(150 / 255, 150 / 255, 150 / 255)

interface Fonts {
  regular: PDFFont
  bold: PDFFont
  italic: PDFFont
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  if (!text) return ['']
  const words = text.split(/\s+/)
  const lines: string[] = []
  let current = ''

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word
    if (font.widthOfTextAtSize(candidate, size) > maxWidth && current) {
      lines.push(current)
      current = word
    } else {
      current = candidate
    }
  }
  if (current) lines.push(current)
  return lines
}

function drawCentered(page: PDFPage, text: string, font: PDFFont, size: number, y: number, color = TITLE_COLOR) {
  const width = font.widthOfTextAtSize(text, size)
  page.drawText(text, { x: (PAGE_WIDTH - width) / 2, y, size, font, color })
}

async function newPage(pdf: PDFDocument) {
  return pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT])
}

function drawFooter(page: PDFPage, pageNumber: number, fonts: Fonts) {
  const text = `Página ${pageNumber}`
  const size = 8
  const width = fonts.italic.widthOfTextAtSize(text, size)
  page.drawText(text, {
    x: (PAGE_WIDTH - width) / 2,
    y: 25,
    size,
    font: fonts.italic,
    color: FOOTER_COLOR,
  })
}

async function writeSong(pdf: PDFDocument, song: SongDocument, fonts: Fonts, pageNumbers: PDFPage[]) {
  let page = await newPage(pdf)
  pageNumbers.push(page)
  const epw = PAGE_WIDTH - 2 * MARGIN
  let y = PAGE_HEIGHT - MARGIN

  drawCentered(page, song.title, fonts.bold, 20, y, TITLE_COLOR)
  y -= 10 + 12 // line height + gap

  drawCentered(page, song.artist, fonts.italic, 13, y, ARTIST_COLOR)
  y -= 8 + 8

  page.drawLine({
    start: { x: MARGIN, y },
    end: { x: PAGE_WIDTH - MARGIN, y },
    thickness: 0.8,
    color: DIVIDER_COLOR,
  })
  y -= 8

  const colWidth = (epw - COL_GAP) / 2
  const colX = [MARGIN, MARGIN + colWidth + COL_GAP]
  const topY = y
  const bottomLimit = MARGIN + 15
  let currentCol = 0

  for (const rawLine of song.lyrics.split('\n')) {
    const isBlank = rawLine.trim() === ''

    if (isBlank) {
      if (y - GAP_H < bottomLimit) {
        if (currentCol === 0) {
          currentCol = 1
          y = topY
        } else {
          page = await newPage(pdf)
          pageNumbers.push(page)
          currentCol = 0
          y = topY
        }
      }
      y -= GAP_H
      continue
    }

    const wrapped = wrapText(rawLine, fonts.regular, 10, colWidth)
    for (const line of wrapped) {
      if (y - LINE_H < bottomLimit) {
        if (currentCol === 0) {
          currentCol = 1
          y = topY
        } else {
          page = await newPage(pdf)
          pageNumbers.push(page)
          currentCol = 0
          y = topY
        }
      }
      page.drawText(line, {
        x: colX[currentCol],
        y: y - LINE_H,
        size: 10,
        font: fonts.regular,
        color: LYRICS_COLOR,
      })
      y -= LINE_H
    }
  }
}

async function buildPdf(songs: SongDocument[]): Promise<Buffer> {
  const pdf = await PDFDocument.create()
  const fonts: Fonts = {
    regular: await pdf.embedFont(StandardFonts.Helvetica),
    bold: await pdf.embedFont(StandardFonts.HelveticaBold),
    italic: await pdf.embedFont(StandardFonts.HelveticaOblique),
  }

  const pages: PDFPage[] = []
  for (const song of songs) {
    await writeSong(pdf, song, fonts, pages)
  }

  pages.forEach((page, i) => drawFooter(page, i + 1, fonts))

  const bytes = await pdf.save()
  return Buffer.from(bytes)
}

/** Generates a single PDF for one song, lyrics laid out in 2 columns. */
export async function generatePdf(song: SongDocument): Promise<Buffer> {
  return buildPdf([song])
}

/** Generates a single PDF with all songs, each starting on a new page. */
export async function generateCombinedPdf(songs: SongDocument[]): Promise<Buffer> {
  return buildPdf(songs)
}
