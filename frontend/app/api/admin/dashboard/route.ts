import { getAdminStats } from "@/lib/server/data";
import { requireAdmin } from "@/lib/server/admin";
import { errorResponse, ok } from "@/lib/server/http";

export async function GET() {
  try {
    await requireAdmin();
    const data = await getAdminStats();
    return ok(data, { status: 200 });
  } catch (error) {
    return errorResponse(error);
  }
}
