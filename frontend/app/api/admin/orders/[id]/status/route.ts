import { requireAdmin } from "../../../../../../lib/server/admin";
import { updateAdminOrderStatus } from "../../../../../../lib/server/data";
import { errorResponse, fail, okMessage } from "../../../../../../lib/server/http";

type Context = {
  params: { id: string };
};

export async function PUT(request: Request, context: Context) {
  try {
    await requireAdmin();
    const { id } = context.params;
    const payload = await request.json();
    const status = String(payload?.status || "").trim();

    if (!status) {
      return fail("status is required.", 400);
    }

    const data = await updateAdminOrderStatus(id, status);
    return okMessage("Order status updated.", data, { status: 200 });
  } catch (error) {
    return errorResponse(error);
  }
}
