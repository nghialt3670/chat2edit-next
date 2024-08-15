'server only'

export async function readFileAsDataURL(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  const base64String = btoa(
    new Uint8Array(buffer).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ''
    )
  )
  const mimeType = file.type || 'application/octet-stream'
  return `data:${mimeType};base64,${base64String}`
}

export async function readFileAsText(file: File): Promise<string> {
  return await file.text()
}
