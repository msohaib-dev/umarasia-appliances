import { errorResponse, fail, ok } from "../../../../lib/server/http";
import { getProductByIdOrSlug } from "../../../../lib/server/data";

type Context = {
  params: { id: string };
};

export async function GET(_request: Request, context: Context) {
  try {
    const { id } = context.params;
    const data = await getProductByIdOrSlug(id);

    if (!data) {
      return fail("Product not found.", 404);
    }

    return ok(data, { status: 200 });
  } catch (error) {
    return errorResponse(error);
  }
}
