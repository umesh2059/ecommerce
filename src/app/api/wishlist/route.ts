import { NextResponse } from "next/server";

import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ========================================
// GET CURRENT USER'S WISHLIST
// GET /api/wishlist
// ========================================

export async function GET() {
  try {
    const { user, response } = await requireAuth();

    if (response) {
      return response;
    }

    const items = await prisma.wishlistItem.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: { product: true },
    });

    return NextResponse.json({
      success: true,
      items,
      productIds: items.map((item) => item.productId),
    });
  } catch (error) {
    console.error("GET WISHLIST ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch wishlist" },
      { status: 500 }
    );
  }
}

// ========================================
// ADD PRODUCT TO WISHLIST
// POST /api/wishlist
// body: { productId }
// ========================================

export async function POST(request: Request) {
  try {
    const { user, response } = await requireAuth();

    if (response) {
      return response;
    }

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { success: false, message: "Missing product id" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    const existing = await prisma.wishlistItem.findUnique({
      where: { userId_productId: { userId: user.id, productId } },
    });

    const item =
      existing ??
      (await prisma.wishlistItem.create({
        data: { userId: user.id, productId },
        include: { product: true },
      }));

    return NextResponse.json(
      { success: true, message: "Added to wishlist", item },
      { status: existing ? 200 : 201 }
    );
  } catch (error) {
    console.error("ADD TO WISHLIST ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to add to wishlist" },
      { status: 500 }
    );
  }
}
