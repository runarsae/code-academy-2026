import { SIZE_LABEL, STATUS_LABEL, type KaffebarEvent, type OrderStatus } from "@/types/domain";

/** Sjekker at en ukjent verdi er en gyldig ordrestatus. */
export function isOrderStatus(value: unknown): value is OrderStatus {
  return typeof value === "string" && Object.hasOwn(STATUS_LABEL, value);
}

/** Tolker data fra en SSE-melding. Returnerer `undefined` ved ugyldig innhold. */
export function parseKaffebarEvent(raw: unknown): KaffebarEvent | undefined {
  if (typeof raw !== "string") return undefined;
  try {
    const event = JSON.parse(raw) as KaffebarEvent;
    const { data } = event ?? {};
    if (event.type !== "order.created" && event.type !== "order.status-changed")
      return undefined;
    if (
      typeof data?.orderId !== "string" ||
      typeof data.customerName !== "string" ||
      typeof data.coffeeName !== "string" ||
      typeof data.quantity !== "number" ||
      !isOrderStatus(data.status) ||
      !Object.hasOwn(SIZE_LABEL, data.size)
    )
      return undefined;
    return event;
  } catch {
    return undefined;
  }
}

/** En ordre er «ny i køen» når den opprettes, eller flyttes tilbake til PENDING. */
export function isNewQueuedOrder(event: KaffebarEvent): boolean {
  if (event.data.status !== "PENDING") return false;
  return (
    event.type === "order.created" ||
    (event.type === "order.status-changed" &&
      event.previousStatus !== undefined &&
      event.previousStatus !== "PENDING")
  );
}
