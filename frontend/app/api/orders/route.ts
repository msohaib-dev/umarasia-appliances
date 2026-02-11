import { createOrder } from "@/lib/server/data";
import { errorResponse, fail } from "@/lib/server/http";
import { NextResponse } from "next/server";

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPakistanPhone = (phone: string) => /^(?:\+92|0)3\d{9}$/.test(phone.replace(/[\s-]/g, ""));

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    const name = String(payload?.customer_name || payload?.name || "").trim();
    const phone = String(payload?.phone || "").trim();
    const email = String(payload?.email || "").trim();
    const city = String(payload?.city || "").trim();
    const address = String(payload?.address || "").trim();
    const items = Array.isArray(payload?.items) ? payload.items : [];
    const total_amount = Number(payload?.total_amount);

    if (!name) return fail("name is required.", 400);
    if (!phone || !isValidPakistanPhone(phone)) return fail("phone must be a valid Pakistan mobile number.", 400);
    if (!address) return fail("address is required.", 400);
    if (!email || !isValidEmail(email)) return fail("email must be valid.", 400);
    if (!city) return fail("city is required.", 400);
    if (!Array.isArray(items) || items.length === 0) return fail("items must be a non-empty array.", 400);
    if (Number.isNaN(total_amount) || total_amount <= 0) return fail("total_amount must be a valid number.", 400);

    const hasInvalidItem = items.some(
      (item: any) =>
        !item ||
        typeof item !== "object" ||
        typeof item.name !== "string" ||
        !item.name.trim() ||
        typeof item.quantity !== "number" ||
        item.quantity < 1 ||
        typeof item.unit_price !== "number" ||
        item.unit_price < 0
    );

    if (hasInvalidItem) {
      return fail("items contain invalid product entries.", 400);
    }

    const order = await createOrder({
      customer_name: name,
      phone,
      email,
      city,
      address,
      items,
      total_amount
    });

    return NextResponse.json(
      {
        success: true,
        message: "Order created successfully.",
        orderId: order.id,
        data: {
          id: order.id,
          status: order.status,
          created_at: order.created_at,
          orderId: order.id
        }
      },
      { status: 201 }
    );
  } catch (error) {
    return errorResponse(error);
  }
}
