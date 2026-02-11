import { requireAdmin } from "../../../lib/server/admin";
import { uploadImageToStorage } from "../../../lib/server/data";
import { errorResponse, fail, okMessage } from "../../../lib/server/http";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const formData = await request.formData();
    const file = formData.get("image");

    if (!(file instanceof File)) {
      return fail("Image file is required.", 400);
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return fail("Only JPEG, PNG, or WEBP images are allowed.", 400);
    }

    const data = await uploadImageToStorage(file);
    return okMessage("Image uploaded.", data, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
