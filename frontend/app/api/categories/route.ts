import { errorResponse, ok } from "../../../lib/server/http";
import { getCategories } from "../../../lib/server/data";

export async function GET() {
  try {
    const data = await getCategories();
    return ok(data, { status: 200 });
  } catch (error) {
    return errorResponse(error);
  }
}
