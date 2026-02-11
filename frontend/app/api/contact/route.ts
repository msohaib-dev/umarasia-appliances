import { createContactMessage } from "@/lib/server/data";
import { errorResponse, fail, okMessage } from "@/lib/server/http";

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPakistanPhone = (phone: string) => /^(?:\+92|0)3\d{9}$/.test(phone.replace(/[\s-]/g, ""));

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const name = String(payload?.name || "").trim();
    const email = String(payload?.email || "").trim();
    const phone = String(payload?.phone || "").trim();
    const message = String(payload?.message || "").trim();

    if (!name) return fail("name is required.", 400);
    if (!email || !isValidEmail(email)) return fail("A valid email is required.", 400);
    if (!phone) return fail("phone is required.", 400);
    if (!isValidPakistanPhone(phone)) return fail("A valid Pakistan phone number is required.", 400);
    if (!message || message.length < 10) return fail("message is required.", 400);

    const data = await createContactMessage({ name, email, phone, message });

    return okMessage("Your message has been received.", data, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
