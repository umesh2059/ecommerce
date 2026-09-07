import { NextResponse } from "next/server";

import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ========================================
// REMOVE PRODUCT FROM WISHLIST
// DELETE /api/wishlist/[productId]
// ========================================

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { user, response } = await requireAuth();

    if (response) {
      return response;
    }

    const { productId } = await params;

    await prisma.wishlistItem.deleteMany({
      where: { userId: user.id, productId },
    });

    return NextResponse.json({
      success: true,
      message: "Removed from wishlist",
    });
  } catch (error) {
    console.error("REMOVE FROM WISHLIST ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to remove from wishlist" },
      { status: 500 }
    );
  }
}
