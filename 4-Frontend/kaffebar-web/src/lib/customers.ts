import type { Order } from "@/types/domain";

export interface ActiveCustomer {
  name: string;
  activeOrders: number;
}

/**
 * API-et har ingen brukerressurs, så en "aktiv bruker" er en kunde som har
 * minst én ordre som ikke er klar ennå (PENDING eller BREWING).
 */
export function activeCustomers(orders: Order[]): ActiveCustomer[] {
  const counts = new Map<string, { name: string; activeOrders: number }>();

  for (const order of orders) {
    if (order.status === "READY") continue;
    const name = order.customerName.trim();
    const key = name.toLowerCase();
    const entry = counts.get(key) ?? { name, activeOrders: 0 };
    entry.activeOrders += 1;
    counts.set(key, entry);
  }

  return [...counts.values()].sort((a, b) => a.name.localeCompare(b.name, "nb"));
}
