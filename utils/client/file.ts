"client only";

export async function readFileAsDataURL(
  file: File | Blob,
): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export async function readFileAsText(
  file: File | Blob,
): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

export function getFilenameFromContentDisposition(
  contentDisposition: string,
): string | null {
  const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
  const matches = filenameRegex.exec(contentDisposition);

  if (matches != null && matches[1]) {
    const filename = matches[1].replace(/['"]/g, "");
    return filename;
  }
  return null;
}
