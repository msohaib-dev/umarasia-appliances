import {
  deleteAdminProduct,
  getAdminProductById,
  getProductByIdOrSlug,
  updateAdminProduct
} from "@/lib/server/data";
import { requireAdmin } from "@/lib/server/admin";
import { errorResponse, fail, ok, okMessage } from "@/lib/server/http";

type Context = {
  params: { id: string };
};

export async function GET(_request: Request, context: Context) {
  try {
    await requireAdmin();
    const { id } = context.params;

    let data;
    try {
      data = await getAdminProductById(id);
    } catch {
      const fallback = await getProductByIdOrSlug(id);
      if (!fallback) {
        return fail("Product not found.", 404);
      }
      data = await getAdminProductById(fallback.id);
    }

    return ok(data, { status: 200 });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request: Request, context: Context) {
  try {
    await requireAdmin();
    const { id } = context.params;
    const payload = await request.json();

    const data = await updateAdminProduct(id, payload || {});
    return okMessage("Product updated.", data, { status: 200 });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_request: Request, context: Context) {
  try {
    await requireAdmin();
    const { id } = context.params;
    await deleteAdminProduct(id);
    return okMessage("Product deleted.", undefined, { status: 200 });
  } catch (error) {
    return errorResponse(error);
  }
}
