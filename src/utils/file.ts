export function getBaseName(filename: string): string {
  const fileNameParts = filename.split('.')
  fileNameParts.pop()
  return fileNameParts.join('.')
}

export function getExtension(filename: string): string {
  return filename.split('.').pop() || ''
}
