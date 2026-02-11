import { getHeroSlides } from "../../../lib/server/data";
import { errorResponse, ok } from "../../../lib/server/http";

export async function GET() {
  try {
    const data = await getHeroSlides();
    return ok(data, { status: 200 });
  } catch (error) {
    return errorResponse(error);
  }
}
