/**
 * In-memory storage for generated documents, keyed by job id.
 *
 * Known limitation: this only works within a single long-lived Node
 * process (local dev or a persistent server container). On multi-instance
 * serverless deployments (Vercel), swap this for external storage
 * (ex: Vercel Blob); see criteria-89a1-webapp-nextjs.md.
 */
const store = new Map<string, { filename: string; contentType: string; data: Buffer }>()

export function saveResult(jobId: string, filename: string, contentType: string, data: Buffer) {
  store.set(jobId, { filename, contentType, data })
}

export function getResult(jobId: string) {
  return store.get(jobId) ?? null
}
