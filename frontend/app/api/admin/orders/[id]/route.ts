import { getAdminOrderById } from "../../../../../lib/server/data";
import { requireAdmin } from "../../../../../lib/server/admin";
import { errorResponse, fail, ok } from "../../../../../lib/server/http";

type Context = {
  params: { id: string };
};

export async function GET(_request: Request, context: Context) {
  try {
    await requireAdmin();
    const { id } = context.params;

    try {
      const data = await getAdminOrderById(id);
      return ok(data, { status: 200 });
    } catch {
      return fail("Order not found.", 404);
    }
  } catch (error) {
    return errorResponse(error);
  }
}
