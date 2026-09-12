/** Converts text to a URL-friendly slug, mirroring `slugify` from find_lyrics.py. */
export function slugify(text: string): string {
  const withoutAccents = text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()

  return withoutAccents
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}
