import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

const hasCloudinaryConfig =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

if (hasCloudinaryConfig) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

const MIME_TO_EXTENSION: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "image/bmp": "bmp",
  "image/svg+xml": "svg",
};

export async function uploadImage(
  fileDataUri: string,
  _folder = "myshoop"
): Promise<string> {
  if (hasCloudinaryConfig) {
    try {
      const uploadResponse = await cloudinary.uploader.upload(fileDataUri, {
        folder: _folder,
        resource_type: "auto",
      });
      return uploadResponse.secure_url;
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      throw new Error("Failed to upload image to Cloudinary");
    }
  }

  const match = fileDataUri.match(/^data:(image\/[a-z0-9.+-]+);base64,(.+)$/i);
  if (!match) {
    throw new Error("Invalid image data URI");
  }

  const extension = MIME_TO_EXTENSION[match[1].toLowerCase()] ?? "jpg";
  const buffer = Buffer.from(match[2], "base64");
  const filename = `${randomUUID()}.${extension}`;

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });
  await writeFile(path.join(uploadsDir, filename), buffer);

  return `/uploads/${filename}`;
}
