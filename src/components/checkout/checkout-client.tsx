"use client";

import { useState } from "react";
import type { Address } from "@prisma/client";

import { AddressSelector } from "./address-selector";
import { PlaceOrderButton } from "./place-order-button";

export function CheckoutClient({
  addresses,
  productSlug,
  productName,
  size,
  userEmail,
  disabled,
}: {
  addresses: Address[];
  productSlug: string;
  productName: string;
  size: string;
  userEmail?: string | null;
  disabled: boolean;
}) {
  const defaultAddress = addresses.find((address) => address.isDefault) ?? addresses[0];
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    defaultAddress?.id ?? null
  );

  return (
    <div className="flex flex-col gap-4">
      <AddressSelector
        initialAddresses={addresses}
        selectedId={selectedAddressId}
        onSelect={setSelectedAddressId}
      />
      <PlaceOrderButton
        productSlug={productSlug}
        productName={productName}
        size={size}
        userEmail={userEmail}
        shippingAddressId={selectedAddressId}
        disabled={disabled}
      />
    </div>
  );
}
