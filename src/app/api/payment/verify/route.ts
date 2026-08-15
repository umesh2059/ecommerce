import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { user, response } = await requireAuth();

    if (response) {
      return response;
    }

    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } =
      await request.json();

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json(
        { success: false, message: "Missing payment details" },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      return NextResponse.json(
        { success: false, message: "Razorpay is not configured" },
        { status: 500 }
      );
    }

    // Razorpay signs "<order_id>|<payment_id>" with the key secret. The
    // signature coming from the client can only be reproduced when the
    // server's secret is known, so a match proves Razorpay really processed
    // this payment and it was not tampered with.
    const expectedSignature = createHmac("sha256", keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    const expected = Buffer.from(expectedSignature, "utf8");
    const received = Buffer.from(razorpaySignature, "utf8");

    if (
      expected.length !== received.length ||
      !timingSafeEqual(expected, received)
    ) {
      return NextResponse.json(
        { success: false, message: "Payment verification failed" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { razorpayOrderId: razorpayOrderId },
      include: { items: true },
    });

    if (!order || order.userId !== user.id) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    if (order.paymentStatus === "COMPLETED") {
      return NextResponse.json({
        success: true,
        orderId: order.id,
        message: "Order already paid",
      });
    }

    const updatedOrder = await prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return tx.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "COMPLETED",
          status: "PROCESSING",
          razorpayPaymentId,
          razorpaySignature,
        },
      });
    });

    return NextResponse.json({
      success: true,
      orderId: updatedOrder.id,
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.error("VERIFY RAZORPAY PAYMENT ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
