import { NextResponse } from "next/server";

import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ========================================
// UPDATE AN ADDRESS (including setting it as default)
// PATCH /api/addresses/[id]
// body: { street?, city?, state?, zip?, country?, isDefault? }
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

    const existing = await prisma.address.findUnique({ where: { id } });

    if (!existing || existing.userId !== user.id) {
      return NextResponse.json(
        { success: false, message: "Address not found" },
        { status: 404 }
      );
    }

    const { street, city, state, zip, country, isDefault } = await request.json();

    const data: Record<string, string | boolean> = {};
    for (const [key, value] of Object.entries({ street, city, state, zip, country })) {
      if (value !== undefined) {
        if (typeof value !== "string" || value.trim().length === 0) {
          return NextResponse.json(
            { success: false, message: `${key} must be a non-empty string` },
            { status: 400 }
          );
        }
        data[key] = value.trim();
      }
    }

    const address = await prisma.$transaction(async (tx) => {
      if (isDefault === true) {
        await tx.address.updateMany({
          where: { userId: user.id },
          data: { isDefault: false },
        });
        data.isDefault = true;
      }

      return tx.address.update({ where: { id }, data });
    });

    return NextResponse.json({ success: true, message: "Address updated", address });
  } catch (error) {
    console.error("UPDATE ADDRESS ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to update address" },
      { status: 500 }
    );
  }
}

// ========================================
// DELETE AN ADDRESS
// DELETE /api/addresses/[id]
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

    const existing = await prisma.address.findUnique({ where: { id } });

    if (!existing || existing.userId !== user.id) {
      return NextResponse.json(
        { success: false, message: "Address not found" },
        { status: 404 }
      );
    }

    await prisma.address.delete({ where: { id } });

    // Promote another address to default so there's always one to preselect,
    // if the deleted one happened to be it.
    if (existing.isDefault) {
      const next = await prisma.address.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      });

      if (next) {
        await prisma.address.update({
          where: { id: next.id },
          data: { isDefault: true },
        });
      }
    }

    return NextResponse.json({ success: true, message: "Address removed" });
  } catch (error) {
    console.error("DELETE ADDRESS ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to delete address" },
      { status: 500 }
    );
  }
}
