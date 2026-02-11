import { getCategoryBySlug } from "../../../../lib/server/data";
import { errorResponse, fail, ok } from "../../../../lib/server/http";

type Context = {
  params: { id: string };
};

export async function GET(_request: Request, context: Context) {
  try {
    const { id } = context.params;
    const data = await getCategoryBySlug(id);

    if (!data) {
      return fail("Category not found.", 404);
    }

    return ok(data, { status: 200 });
  } catch (error) {
    return errorResponse(error);
  }
}
