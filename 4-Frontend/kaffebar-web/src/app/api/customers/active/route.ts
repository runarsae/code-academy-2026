import { NextResponse } from "next/server";
import { fetchOrders } from "@/lib/api";
import { activeCustomers } from "@/lib/customers";

export const dynamic = "force-dynamic";

/** Returnerer alle kunder med minst én ordre som ikke er klar. */
export async function GET() {
  try {
    const orders = await fetchOrders();
    return NextResponse.json(activeCustomers(orders));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ukjent feil";
    return NextResponse.json({ message }, { status: 502 });
  }
}
