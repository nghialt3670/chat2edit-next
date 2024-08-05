"use server";

import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongo";

export async function getFiles(fileIds: string[]): Promise<(File | null)[]> {
  await connectToDatabase();
  const conn = mongoose.connection;
  const bucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "files",
  });

  return await Promise.all(
    fileIds.map(async (fileId) => {
      try {
        const id = new mongoose.Types.ObjectId(fileId);
        const readStream = bucket.openDownloadStream(id);
        const fileDoc = await conn.db
          .collection("files.files")
          .findOne({ _id: id });
        console.log(fileDoc);
        if (!fileDoc) return null;
        const chunks: Buffer[] = [];

        return new Promise<File>((resolve, reject) => {
          readStream.on("data", (chunk) => chunks.push(chunk));
          readStream.on("end", () => {
            const file = new File(
              [Buffer.concat(chunks)],
              fileDoc.filename || "unknown",
              {
                type: fileDoc.contentType || "application/octet-stream",
              },
            );
            resolve(file);
          });
          readStream.on("error", reject);
        });
      } catch (error) {
        return null;
      }
    }),
  );
}
