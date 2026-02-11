import { listAdminOrders } from "@/lib/server/data";
import { requireAdmin } from "@/lib/server/admin";
import { errorResponse, ok } from "@/lib/server/http";

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const status = String(searchParams.get("status") || "").trim();

    const all = await listAdminOrders();
    const filtered = status ? all.filter((item: { status: string }) => item.status === status) : all;
    return ok(filtered, { status: 200 });
  } catch (error) {
    return errorResponse(error);
  }
}
