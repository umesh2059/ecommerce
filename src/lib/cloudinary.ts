import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary if environment variables are provided
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

/**
 * Uploads an image base64 string or file path to Cloudinary.
 * If credentials are not configured, it returns a premium mockup/stock image URL.
 */
export async function uploadImage(
  fileDataUri: string,
  folder = "myshoop"
): Promise<string> {
  if (!hasCloudinaryConfig) {
    console.warn(
      "Cloudinary credentials are not configured in your .env file. Falling back to a premium stock image placeholder."
    );
    // Return a random high-quality stock e-commerce image based on keywords or default placeholder
    const fallbackImages = [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&auto=format&fit=crop&q=60",
    ];
    return fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
  }

  try {
    const uploadResponse = await cloudinary.uploader.upload(fileDataUri, {
      folder,
      resource_type: "auto",
    });
    return uploadResponse.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error("Failed to upload image to Cloudinary");
  }
}
