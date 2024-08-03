import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Grid from "gridfs-stream";
import connectToDatabase from "@/lib/mongo";

let gfs: Grid.Grid | undefined;

export async function GET(request: Request) {
  try {
    // Extract file ID from URL parameters
    const url = new URL(request.url);
    const fileId = url.searchParams.get("id");

    if (!fileId) {
      return NextResponse.json(
        { error: "File ID is required" },
        { status: 400 },
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Initialize GridFS if it hasn't been already
    if (!gfs) {
      const conn = mongoose.connection;
      gfs = Grid(conn.db, mongoose.mongo);
      gfs.collection("uploads"); // Ensure this matches your GridFS collection name
    }

    // Ensure fileId is a valid ObjectId string
    if (!mongoose.Types.ObjectId.isValid(fileId)) {
      return NextResponse.json({ error: "Invalid File ID" }, { status: 400 });
    }

    // Find the file in GridFS
    const file = await gfs.files.findOne({
      _id: new mongoose.Types.ObjectId(fileId),
    });
    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Create a read stream for the file
    const readStream = gfs.createReadStream({
      _id: fileId,
    });

    // Convert ReadStream to ReadableStream
    const readableStream = new ReadableStream({
      start(controller) {
        readStream.on("data", (chunk) => controller.enqueue(chunk));
        readStream.on("end", () => controller.close());
        readStream.on("error", (err) => controller.error(err));
      },
    });

    // Prepare response headers and stream
    const response = new Response(readableStream, {
      headers: {
        "Content-Type": file.contentType || "application/octet-stream",
      },
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch the file" },
      { status: 500 },
    );
  }
}
