import { NextResponse } from "next/server";
import Razorpay from "razorpay";

import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProductSize } from "@prisma/client";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

const PRODUCT_SIZES = new Set(Object.values(ProductSize));

function getRazorpay() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are not configured");
  }
  return razorpay;
}

export async function POST(request: Request) {
  try {
    const { user, response } = await requireAuth();

    if (response) {
      return response;
    }

    const { productSlug, size, quantity = 1 } = await request.json();

    if (!productSlug) {
      return NextResponse.json(
        { success: false, message: "Missing product slug" },
        { status: 400 }
      );
    }

    if (!size || !PRODUCT_SIZES.has(size)) {
      return NextResponse.json(
        { success: false, message: "A valid size is required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { slug: productSlug },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { success: false, message: "Product is out of stock" },
        { status: 400 }
      );
    }

    // Amounts are stored in paise (1/100 of a rupee), mirroring the cents
    // convention already used across the app (formatPrice divides by 100).
    const subtotal = product.price * quantity;
    const shipping = subtotal >= 7500 || subtotal === 0 ? 0 : 999;
    const total = subtotal + shipping;

    const order = await getRazorpay().orders.create({
      amount: total,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    const dbOrder = await prisma.order.create({
      data: {
        userId: user.id,
        total,
        razorpayOrderId: order.id,
        items: {
          create: {
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity,
            size,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      orderId: dbOrder.id,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("CREATE RAZORPAY ORDER ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Unable to create payment order" },
      { status: 500 }
    );
  }
}
