import { NextResponse } from "next/server";

import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ========================================
// GET CURRENT USER'S SAVED ADDRESSES
// GET /api/addresses
// ========================================

export async function GET() {
  try {
    const { user, response } = await requireAuth();

    if (response) {
      return response;
    }

    const addresses = await prisma.address.findMany({
      where: { userId: user.id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ success: true, addresses });
  } catch (error) {
    console.error("GET ADDRESSES ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch addresses" },
      { status: 500 }
    );
  }
}

// ========================================
// ADD A NEW DELIVERY ADDRESS
// POST /api/addresses
// body: { street, city, state, zip, country, isDefault? }
// ========================================

export async function POST(request: Request) {
  try {
    const { user, response } = await requireAuth();

    if (response) {
      return response;
    }

    const { street, city, state, zip, country, isDefault } = await request.json();

    const fields = { street, city, state, zip, country };

    for (const [key, value] of Object.entries(fields)) {
      if (typeof value !== "string" || value.trim().length === 0) {
        return NextResponse.json(
          { success: false, message: `${key} is required` },
          { status: 400 }
        );
      }
    }

    const existingCount = await prisma.address.count({ where: { userId: user.id } });
    const shouldBeDefault = Boolean(isDefault) || existingCount === 0;

    const address = await prisma.$transaction(async (tx) => {
      if (shouldBeDefault) {
        await tx.address.updateMany({
          where: { userId: user.id },
          data: { isDefault: false },
        });
      }

      return tx.address.create({
        data: {
          userId: user.id,
          street: street.trim(),
          city: city.trim(),
          state: state.trim(),
          zip: zip.trim(),
          country: country.trim(),
          isDefault: shouldBeDefault,
        },
      });
    });

    return NextResponse.json(
      { success: true, message: "Address added", address },
      { status: 201 }
    );
  } catch (error) {
    console.error("ADD ADDRESS ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to add address" },
      { status: 500 }
    );
  }
}
