export function getBaseName(filename: string): string {
  const fileNameParts = filename.split(".");
  fileNameParts.pop();
  return fileNameParts.join(".");
}

export function getExtension(filename: string): string {
  return filename.split(".").pop() || "";
}

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

export async function generateThumbnail(file: File): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const video = document.createElement("video");

    // this is important
    video.autoplay = true;
    video.muted = true;
    video.src = URL.createObjectURL(file);

    video.onloadeddata = () => {
      let ctx = canvas.getContext("2d")!;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      video.pause();
      return resolve(canvas.toDataURL("image/png"));
    };
  });
}
