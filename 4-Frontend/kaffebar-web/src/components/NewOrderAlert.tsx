"use client";

import { SIZE_LABEL, type Order } from "@/types/domain";

/** Varsel om ny bestilling i køen. Stables øverst på baristaskjermen. */
export function NewOrderAlert({
  order,
  onDismiss,
}: {
  order: Order;
  onDismiss: () => void;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center justify-between gap-3 rounded-lg border border-line bg-accent-soft px-3 py-2 text-sm"
    >
      <span>
        Ny bestilling: {order.quantity} × {order.coffeeName} (
        {SIZE_LABEL[order.size]}) til {order.customerName}
      </span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Lukk varsel"
        className="text-secondary hover:underline"
      >
        Lukk
      </button>
    </div>
  );
}
