import { getHeroSlides, replaceHeroSlides } from "@/lib/server/data";
import { requireAdmin } from "@/lib/server/admin";
import { errorResponse, ok, okMessage } from "@/lib/server/http";

export async function GET() {
  try {
    await requireAdmin();
    const data = await getHeroSlides();
    return ok(data, { status: 200 });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
    const payload = await request.json();
    const slides = Array.isArray(payload?.slides) ? payload.slides : [];
    const data = await replaceHeroSlides(slides);
    return okMessage("Hero slides updated.", data, { status: 200 });
  } catch (error) {
    return errorResponse(error);
  }
}
