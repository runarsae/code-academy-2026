import { beforeEach, describe, expect, it, vi } from "vitest";
import { activeCustomers } from "@/lib/customers";
import type { Order, OrderStatus } from "@/types/domain";

vi.mock("@/lib/api", () => ({ fetchOrders: vi.fn() }));

import { fetchOrders } from "@/lib/api";
import { GET } from "@/app/api/customers/active/route";

const order = (customerName: string, status: OrderStatus): Order =>
  ({ id: crypto.randomUUID(), customerName, status }) as Order;

describe("activeCustomers", () => {
  it("ignorerer ordrer som er klare", () => {
    expect(activeCustomers([order("Ada", "READY")])).toEqual([]);
  });

  it("teller aktive ordrer per kunde og slår sammen ulik skrivemåte", () => {
    const result = activeCustomers([
      order("Ada", "PENDING"),
      order(" ada ", "BREWING"),
      order("Bo", "READY"),
      order("Bo", "PENDING"),
    ]);
    expect(result).toEqual([
      { name: "Ada", activeOrders: 2 },
      { name: "Bo", activeOrders: 1 },
    ]);
  });

  it("sorterer på navn", () => {
    const names = activeCustomers([order("Cecilie", "PENDING"), order("Ada", "PENDING")]).map(
      (c) => c.name,
    );
    expect(names).toEqual(["Ada", "Cecilie"]);
  });
});

describe("GET /api/customers/active", () => {
  beforeEach(() => {
    vi.mocked(fetchOrders).mockReset();
  });

  it("returnerer aktive kunder", async () => {
    vi.mocked(fetchOrders).mockResolvedValue([order("Ada", "BREWING"), order("Bo", "READY")]);
    const response = await GET();
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual([{ name: "Ada", activeOrders: 1 }]);
  });

  it("svarer 502 når API-et feiler", async () => {
    vi.mocked(fetchOrders).mockImplementation(async () => {
      throw new Error("nede");
    });
    const response = await GET();
    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ message: "nede" });
  });
});
