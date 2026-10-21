import { describe, expect, it, vi } from "vitest";
import type { NextRequest } from "next/server";

vi.mock("@/lib/api", () => ({ updateOrderStatus: vi.fn(), deleteOrder: vi.fn() }));

import { updateOrderStatus } from "@/lib/api";
import { isNewQueuedOrder, isOrderStatus, parseKaffebarEvent } from "@/lib/orders";
import type { KaffebarEvent, OrderStatus } from "@/types/domain";
import { PATCH } from "@/app/api/orders/[orderId]/route";

const patch = (body: unknown) =>
  PATCH({ json: async () => body } as NextRequest, {
    params: Promise.resolve({ orderId: "abc" }),
  });

describe("isOrderStatus", () => {
  it("godtar gyldige og avviser ugyldige statuser", () => {
    expect(isOrderStatus("READY")).toBe(true);
    expect(isOrderStatus("toString")).toBe(false);
    expect(isOrderStatus(undefined)).toBe(false);
  });
});

describe("PATCH /api/orders/[orderId]", () => {
  it("svarer 400 ved ugyldig status", async () => {
    const response = await patch({ status: "FERDIG" });
    expect(response.status).toBe(400);
  });

  it("oppdaterer ordren ved gyldig status", async () => {
    vi.mocked(updateOrderStatus).mockResolvedValue({ status: "READY" } as never);
    const response = await patch({ status: "READY" });
    expect(response.status).toBe(200);
    expect(updateOrderStatus).toHaveBeenCalledWith("abc", "READY");
  });
});

describe("parseKaffebarEvent", () => {
  const ordre = {
    orderId: "1",
    customerName: "Ada",
    coffeeName: "Latte",
    quantity: 1,
    size: "MEDIUM",
    status: "PENDING",
  };

  it("tolker gyldig JSON", () => {
    const event = parseKaffebarEvent(JSON.stringify({ type: "order.created", data: ordre }));
    expect(event?.data.orderId).toBe("1");
  });

  it("returnerer undefined ved ugyldig innhold", () => {
    expect(parseKaffebarEvent("{ikke json")).toBeUndefined();
    expect(parseKaffebarEvent(undefined)).toBeUndefined();
    expect(parseKaffebarEvent("{}")).toBeUndefined();
    expect(
      parseKaffebarEvent(JSON.stringify({ type: "ukjent", data: ordre })),
    ).toBeUndefined();
    expect(
      parseKaffebarEvent(
        JSON.stringify({ type: "order.created", data: { orderId: "1" } }),
      ),
    ).toBeUndefined();
  });
});

describe("isNewQueuedOrder", () => {
  const lag = (type: KaffebarEvent["type"], status: OrderStatus, previousStatus?: OrderStatus) =>
    ({ type, timestamp: "", previousStatus, data: { status } }) as KaffebarEvent;

  it("er true for ny ordre", () => {
    expect(isNewQueuedOrder(lag("order.created", "PENDING"))).toBe(true);
  });

  it("er true når en ordre flyttes tilbake til PENDING", () => {
    expect(isNewQueuedOrder(lag("order.status-changed", "PENDING", "READY"))).toBe(true);
  });

  it("er false for andre statusendringer", () => {
    expect(isNewQueuedOrder(lag("order.status-changed", "READY", "BREWING"))).toBe(false);
  });
});
