"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

type RazorpayCheckout = {
  open: () => void;
  close: () => void;
};

type RazorpayStatic = {
  new (options: Record<string, unknown>): RazorpayCheckout;
};

declare global {
  interface Window {
    Razorpay?: RazorpayStatic;
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

type CreateOrderResponse = {
  success: boolean;
  message?: string;
  orderId?: string;
  key?: string;
  order?: {
    id: string;
    amount: number;
    currency: string;
  };
};

export function PlaceOrderButton({
  productSlug,
  productName,
  size,
  userEmail,
  disabled,
}: {
  productSlug: string;
  productName: string;
  size: string;
  userEmail?: string | null;
  disabled: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePlaceOrder() {
    if (disabled) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const createResponse = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug,
          size,
          quantity: 1,
        }),
      });

      const createData: CreateOrderResponse = await createResponse.json();

      if (!createResponse.ok || !createData.success) {
        setError(createData.message ?? "Unable to start payment");
        setLoading(false);
        return;
      }

      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        setError("Razorpay failed to load. Please try again.");
        setLoading(false);
        return;
      }

      const options = {
        key: createData.key,
        amount: createData.order?.amount,
        currency: createData.order?.currency,
        name: "MyShoop",
        description: productName,
        order_id: createData.order?.id,
        prefill: {
          contact: "",
          email: userEmail ?? "",
        },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          const verifyResponse = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyResponse.json();

          if (verifyResponse.ok && verifyData.success) {
            router.push("/");
          } else {
            setError(verifyData.message ?? "Payment could not be verified");
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      if (!window.Razorpay) {
        setError("Razorpay failed to load. Please try again.");
        setLoading(false);
        return;
      }

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("PLACE ORDER ERROR:", err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        size="lg"
        className="w-full"
        disabled={disabled || loading}
        onClick={handlePlaceOrder}
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Opening secure payment…
          </>
        ) : disabled ? (
          "Add an item to checkout"
        ) : (
          "Place order"
        )}
      </Button>
      {error && (
        <p className="text-center text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
