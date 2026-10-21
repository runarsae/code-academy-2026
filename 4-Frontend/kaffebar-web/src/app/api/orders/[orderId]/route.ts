import { NextResponse, type NextRequest } from "next/server";
import { deleteOrder, updateOrderStatus } from "@/lib/api";
import { isOrderStatus } from "@/lib/orders";
import type { OrderStatus } from "@/types/domain";

export const dynamic = "force-dynamic";

/**
 * BFF for baristaknappene. Utlevert — bruker updateOrderStatus fra src/lib/api.ts.
 */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await context.params;
  const body = (await request.json().catch(() => null)) as { status?: unknown } | null;

  if (!isOrderStatus(body?.status)) {
    return NextResponse.json(
      { message: "Ugyldig status. Må være PENDING, BREWING eller READY." },
      { status: 400 },
    );
  }
  const status: OrderStatus = body.status;

  try {
    return NextResponse.json(await updateOrderStatus(orderId, status));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ukjent feil";
    return NextResponse.json({ message }, { status: 502 });
  }
}

/** Sletter en ordre. Svarer 204 uten innhold når den er slettet. */
export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await context.params;

  try {
    await deleteOrder(orderId);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ukjent feil";
    return NextResponse.json({ message }, { status: 502 });
  }
}
