import { errorResponse, ok } from "@/lib/server/http";
import { getProducts } from "@/lib/server/data";

export async function GET() {
  try {
    const data = await getProducts();
    return ok(data, { status: 200 });
  } catch (error) {
    return errorResponse(error);
  }
}
