import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// ========================================
// CREATE PRODUCT (admin only)
// POST /api/products
// ========================================

export async function POST(request: Request) {
  try {
    const { response } = await requireAdmin();

    if (response) {
      return response;
    }

    const body = await request.json();

    const {
      slug,
      name,
      description,
      price,
      compareAtPrice,
      category,
      image,
      images,
      sizes,
      colors,
      stock,
      isFeatured,
      isNew,
    } = body;

    // Basic validation
    if (
      !slug ||
      !name ||
      !description ||
      price === undefined ||
      !category ||
      !image
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Required product fields are missing",
        },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingProduct = await prisma.product.findUnique({
      where: {
        slug: slug,
      },
    });

    if (existingProduct) {
      return NextResponse.json(
        {
          success: false,
          message: "Product with this slug already exists",
        },
        { status: 409 }
      );
    }

    if (typeof price !== "number" || !Number.isInteger(price) || price <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Price must be a positive integer (amount in cents)",
        },
        { status: 400 }
      );
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        slug,
        name,
        description,
        price,
        compareAtPrice,
        category,
        image,
        images: images ?? [],
        sizes: sizes ?? [],
        colors: colors ?? [],
        stock: stock ?? 0,
        isFeatured: isFeatured ?? false,
        isNew: isNew ?? false,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create product",
      },
      { status: 500 }
    );
  }
}

// ========================================
// GET ALL PRODUCTS
// GET /api/products
// ========================================

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch products",
      },
      { status: 500 }
    );
  }
}