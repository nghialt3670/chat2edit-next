import mongoose from "mongoose";

export async function uploadFilesToGridFS(
  files: File[],
  bucket: mongoose.mongo.GridFSBucket,
): Promise<mongoose.Types.ObjectId[]> {
  return await Promise.all(
    files.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadStream = bucket.openUploadStream(file.name, {
        contentType: file.type,
      });

      uploadStream.end(buffer);

      return new Promise((resolve, reject) => {
        uploadStream.on("finish", () => resolve(uploadStream.id));
        uploadStream.on("error", (error) => reject(error));
      });
    }),
  );
}
