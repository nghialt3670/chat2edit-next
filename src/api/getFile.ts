import { getFilenameFromContentDisposition } from '@/utils/client/file'

export default async function getFile(fileId: string): Promise<File | null> {
  const endpoint = `/api/files/${fileId}`
  const response = await fetch(endpoint)
  if (!response.ok) return null

  const blob = await response.blob()

  const contentDisposition = response.headers.get('Content-Disposition')
  if (!contentDisposition) return null

  const filename = getFilenameFromContentDisposition(contentDisposition)
  if (!filename) return null

  return new File([blob], filename, { type: blob.type })
}
