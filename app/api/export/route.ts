import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageData, format = "png", quality = 90, width, height } = body;

    if (!imageData || typeof imageData !== "string") {
      return NextResponse.json({ error: "No image data provided" }, { status: 400 });
    }

    const base64Data = imageData.split(",")[1];
    if (!base64Data) {
      return NextResponse.json({ error: "Invalid image data" }, { status: 400 });
    }

    let pipeline = sharp(Buffer.from(base64Data, "base64"));

    if (width && height) {
      pipeline = pipeline.resize(width, height, { fit: "inside", withoutEnlargement: false });
    }

    let outputBuffer: Buffer;
    if (format === "jpg" || format === "jpeg") {
      outputBuffer = await pipeline.jpeg({ quality, progressive: true }).toBuffer();
    } else if (format === "webp") {
      outputBuffer = await pipeline.webp({ quality }).toBuffer();
    } else {
      outputBuffer = await pipeline.png({ compressionLevel: 6 }).toBuffer();
    }

    return new NextResponse(outputBuffer, {
      headers: {
        "Content-Type": format === "jpg" || format === "jpeg" ? "image/jpeg" : format === "webp" ? "image/webp" : "image/png",
        "Content-Disposition": `attachment; filename="export.${format === "jpg" || format === "jpeg" ? "jpg" : format === "webp" ? "webp" : "png"}"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
