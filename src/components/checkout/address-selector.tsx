"use client";

import { useState } from "react";
import { Loader2, MapPin, Plus } from "lucide-react";
import type { Address } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AddressFormState = {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

const EMPTY_FORM: AddressFormState = {
  street: "",
  city: "",
  state: "",
  zip: "",
  country: "",
};

export function AddressSelector({
  initialAddresses,
  selectedId,
  onSelect,
}: {
  initialAddresses: Address[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [isAdding, setIsAdding] = useState(initialAddresses.length === 0);
  const [form, setForm] = useState<AddressFormState>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSaveAddress(event: React.FormEvent) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message ?? "Unable to save address");
        setIsSaving(false);
        return;
      }

      setAddresses((prev) => [data.address, ...prev]);
      onSelect(data.address.id);
      setForm(EMPTY_FORM);
      setIsAdding(false);
    } catch (err) {
      console.error("SAVE ADDRESS ERROR:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border p-5">
      <p className="flex items-center gap-1.5 text-sm font-semibold">
        <MapPin className="size-4" />
        Delivery address
      </p>

      {addresses.length > 0 && (
        <div className="flex flex-col gap-2">
          {addresses.map((address) => (
            <label
              key={address.id}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm transition-colors",
                selectedId === address.id
                  ? "border-foreground bg-muted/40"
                  : "border-border hover:bg-muted/20"
              )}
            >
              <input
                type="radio"
                name="shippingAddress"
                className="mt-1"
                checked={selectedId === address.id}
                onChange={() => onSelect(address.id)}
              />
              <span className="flex flex-col">
                <span className="font-medium">
                  {address.street}
                  {address.isDefault && (
                    <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs font-normal text-muted-foreground">
                      Default
                    </span>
                  )}
                </span>
                <span className="text-muted-foreground">
                  {address.city}, {address.state} {address.zip}, {address.country}
                </span>
              </span>
            </label>
          ))}
        </div>
      )}

      {isAdding ? (
        <form onSubmit={handleSaveAddress} className="flex flex-col gap-2 pt-1">
          <input
            required
            placeholder="Street address"
            value={form.street}
            onChange={(e) => setForm({ ...form, street: e.target.value })}
            className="h-9 rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:border-ring"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              required
              placeholder="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="h-9 rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:border-ring"
            />
            <input
              required
              placeholder="State"
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              className="h-9 rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:border-ring"
            />
            <input
              required
              placeholder="ZIP / Postal code"
              value={form.zip}
              onChange={(e) => setForm({ ...form, zip: e.target.value })}
              className="h-9 rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:border-ring"
            />
            <input
              required
              placeholder="Country"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              className="h-9 rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:border-ring"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex gap-2 pt-1">
            <Button type="submit" size="sm" disabled={isSaving}>
              {isSaving ? <Loader2 className="size-3.5 animate-spin" /> : null}
              Save address
            </Button>
            {addresses.length > 0 && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsAdding(false);
                  setError(null);
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      ) : (
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => setIsAdding(true)}
          className="self-start"
        >
          <Plus className="size-3.5" />
          Add new address
        </Button>
      )}
    </div>
  );
}
