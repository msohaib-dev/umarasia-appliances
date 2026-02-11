import { createAdminProduct, listAdminProducts } from "@/lib/server/data";
import { requireAdmin } from "@/lib/server/admin";
import { errorResponse, ok, okMessage } from "@/lib/server/http";

export async function GET() {
  try {
    await requireAdmin();
    const data = await listAdminProducts();
    return ok(data, { status: 200 });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const payload = await request.json();
    const data = await createAdminProduct(payload || {});
    return okMessage("Product created.", data, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
