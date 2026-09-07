import { NextResponse } from "next/server";

import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ========================================
// UPDATE CART ITEM QUANTITY
// PATCH /api/cart/[id]
// body: { quantity }
// ========================================

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, response } = await requireAuth();

    if (response) {
      return response;
    }

    const { id } = await params;
    const { quantity } = await request.json();

    if (!Number.isInteger(quantity) || quantity < 1) {
      return NextResponse.json(
        { success: false, message: "Quantity must be a positive integer" },
        { status: 400 }
      );
    }

    const existing = await prisma.cartItem.findUnique({ where: { id } });

    if (!existing || existing.userId !== user.id) {
      return NextResponse.json(
        { success: false, message: "Cart item not found" },
        { status: 404 }
      );
    }

    const item = await prisma.cartItem.update({
      where: { id },
      data: { quantity },
      include: { product: true },
    });

    const count = await prisma.cartItem.aggregate({
      where: { userId: user.id },
      _sum: { quantity: true },
    });

    return NextResponse.json({
      success: true,
      item,
      count: count._sum.quantity ?? 0,
    });
  } catch (error) {
    console.error("UPDATE CART ITEM ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to update cart item" },
      { status: 500 }
    );
  }
}

// ========================================
// REMOVE CART ITEM
// DELETE /api/cart/[id]
// ========================================

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, response } = await requireAuth();

    if (response) {
      return response;
    }

    const { id } = await params;

    const existing = await prisma.cartItem.findUnique({ where: { id } });

    if (!existing || existing.userId !== user.id) {
      return NextResponse.json(
        { success: false, message: "Cart item not found" },
        { status: 404 }
      );
    }

    await prisma.cartItem.delete({ where: { id } });

    const count = await prisma.cartItem.aggregate({
      where: { userId: user.id },
      _sum: { quantity: true },
    });

    return NextResponse.json({
      success: true,
      message: "Removed from cart",
      count: count._sum.quantity ?? 0,
    });
  } catch (error) {
    console.error("REMOVE CART ITEM ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to remove cart item" },
      { status: 500 }
    );
  }
}
