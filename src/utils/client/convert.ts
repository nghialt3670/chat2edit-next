import { initCanvasFromFile } from '../server/fabric'
import { getBaseName, getExtension } from './file'

export async function convertFile(file: File): Promise<File> {
  switch (getExtension(file.name)) {
    case 'canvas':
      return file
    case 'jpeg':
    case 'jpg':
    case 'png':
    case 'gif':
    case 'bmp':
    case 'webp':
    case 'tiff':
    case 'svg+xml':
    case 'vnd.microsoft.icon':
    case 'heif':
    case 'heic':
    case 'avif':
    case 'ico':
      const canvas = await initCanvasFromFile(file)
      const baseName = getBaseName(canvas.backgroundImage?.get('filename'))
      const newFilename = `${baseName}.canvas`
      const blob = new Blob([JSON.stringify(canvas.toObject(['filename']))], {
        type: 'application/json'
      })
      return new File([blob], newFilename, { type: 'application/json' })
    default:
      throw new Error('Unsupported file')
  }
}
