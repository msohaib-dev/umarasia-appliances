import { errorResponse, ok } from "../../../lib/server/http";
import { searchProductsAndSuggestions } from "../../../lib/server/data";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";

    if (!q.trim()) {
      return ok({ suggestions: [], products: [], categories: [] }, { status: 200 });
    }

    const data = await searchProductsAndSuggestions(q);
    return ok(data, { status: 200 });
  } catch (error) {
    return errorResponse(error);
  }
}
