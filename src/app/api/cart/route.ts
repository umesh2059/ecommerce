import { NextResponse } from "next/server";
import { ProductSize } from "@prisma/client";

import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const PRODUCT_SIZES = new Set(Object.values(ProductSize));

// ========================================
// GET CURRENT USER'S CART
// GET /api/cart
// ========================================

export async function GET() {
  try {
    const { user, response } = await requireAuth();

    if (response) {
      return response;
    }

    const items = await prisma.cartItem.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: { product: true },
    });

    return NextResponse.json({
      success: true,
      items,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
    });
  } catch (error) {
    console.error("GET CART ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

// ========================================
// ADD ITEM TO CART
// POST /api/cart
// body: { productId, size, quantity? }
// ========================================

export async function POST(request: Request) {
  try {
    const { user, response } = await requireAuth();

    if (response) {
      return response;
    }

    const { productId, size, quantity = 1 } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { success: false, message: "Missing product id" },
        { status: 400 }
      );
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return NextResponse.json(
        { success: false, message: "Quantity must be a positive integer" },
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

    // Products without configured sizes still need a value for the
    // non-nullable CartItem.size column, so fall back to a placeholder size.
    const resolvedSize =
      product.sizes.length > 0 ? size : ProductSize.M;

    if (product.sizes.length > 0 && (!resolvedSize || !PRODUCT_SIZES.has(resolvedSize))) {
      return NextResponse.json(
        { success: false, message: "Please select a valid size" },
        { status: 400 }
      );
    }

    if (product.stock <= 0) {
      return NextResponse.json(
        { success: false, message: "Product is out of stock" },
        { status: 400 }
      );
    }

    const existing = await prisma.cartItem.findUnique({
      where: {
        userId_productId_size: {
          userId: user.id,
          productId,
          size: resolvedSize,
        },
      },
    });

    const item = existing
      ? await prisma.cartItem.update({
          where: { id: existing.id },
          data: { quantity: existing.quantity + quantity },
          include: { product: true },
        })
      : await prisma.cartItem.create({
          data: { userId: user.id, productId, size: resolvedSize, quantity },
          include: { product: true },
        });

    const count = await prisma.cartItem.aggregate({
      where: { userId: user.id },
      _sum: { quantity: true },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Added to cart",
        item,
        count: count._sum.quantity ?? 0,
      },
      { status: existing ? 200 : 201 }
    );
  } catch (error) {
    console.error("ADD TO CART ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to add item to cart" },
      { status: 500 }
    );
  }
}
