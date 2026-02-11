import {
  deleteAdminCategory,
  getAdminCategoryById,
  getCategoryBySlug,
  updateAdminCategory
} from "../../../../../lib/server/data";
import { requireAdmin } from "../../../../../lib/server/admin";
import { errorResponse, fail, ok, okMessage } from "../../../../../lib/server/http";

type Context = {
  params: { id: string };
};

export async function GET(_request: Request, context: Context) {
  try {
    await requireAdmin();
    const { id } = context.params;

    let data;
    try {
      data = await getAdminCategoryById(id);
    } catch {
      const fallback = await getCategoryBySlug(id);
      if (!fallback) {
        return fail("Category not found.", 404);
      }
      data = await getAdminCategoryById(fallback.id);
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
    const data = await updateAdminCategory(id, payload || {});
    return okMessage("Category updated.", data, { status: 200 });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_request: Request, context: Context) {
  try {
    await requireAdmin();
    const { id } = context.params;
    await deleteAdminCategory(id);
    return okMessage("Category deleted.", undefined, { status: 200 });
  } catch (error) {
    return errorResponse(error);
  }
}
