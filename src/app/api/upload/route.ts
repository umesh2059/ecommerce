import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const { response } = await requireAdmin();
    if (response) {
      return response;
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 }
      );
    }

    // Convert file to base64 data URI for Cloudinary upload
    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type;
    const base64Data = buffer.toString("base64");
    const fileDataUri = `data:${mimeType};base64,${base64Data}`;

    const imageUrl = await uploadImage(fileDataUri);

    return NextResponse.json({
      success: true,
      url: imageUrl,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to upload image" },
      { status: 500 }
    );
  }
}
