import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

type RouteParams = {
  params: Promise<{ id: string }>;
};

// ========================================
// GET PRODUCT (public)
// GET /api/products/:id
// ========================================

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch product",
      },
      { status: 500 }
    );
  }
}

// ========================================
// UPDATE PRODUCT (admin only)
// PUT /api/products/:id
// ========================================

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { response } = await requireAdmin();

    if (response) {
      return response;
    }

    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.product.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        { status: 404 }
      );
    }

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

    if (typeof price !== "undefined" && (typeof price !== "number" || !Number.isInteger(price) || price <= 0)) {
      return NextResponse.json(
        {
          success: false,
          message: "Price must be a positive integer (amount in cents)",
        },
        { status: 400 }
      );
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(slug !== undefined ? { slug } : {}),
        ...(name !== undefined ? { name } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(price !== undefined ? { price } : {}),
        ...(compareAtPrice !== undefined ? { compareAtPrice } : {}),
        ...(category !== undefined ? { category } : {}),
        ...(image !== undefined ? { image } : {}),
        ...(images !== undefined ? { images } : {}),
        ...(sizes !== undefined ? { sizes } : {}),
        ...(colors !== undefined ? { colors } : {}),
        ...(stock !== undefined ? { stock } : {}),
        ...(isFeatured !== undefined ? { isFeatured } : {}),
        ...(isNew !== undefined ? { isNew } : {}),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update product",
      },
      { status: 500 }
    );
  }
}

export const PATCH = PUT;

// ========================================
// DELETE PRODUCT (admin only)
// DELETE /api/products/:id
// ========================================

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { response } = await requireAdmin();

    if (response) {
      return response;
    }

    const { id } = await params;

    const existing = await prisma.product.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        { status: 404 }
      );
    }

    try {
      await prisma.product.delete({
        where: { id },
      });
    } catch (error) {
      console.error("DELETE PRODUCT PRISMA ERROR:", error);

      return NextResponse.json(
        {
          success: false,
          message:
            "Cannot delete product because it is referenced by existing orders or cart items",
        },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete product",
      },
      { status: 500 }
    );
  }
}