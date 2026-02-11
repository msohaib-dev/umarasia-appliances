import { errorResponse, ok } from "../../../../../lib/server/http";
import { requireAdmin } from "../../../../../lib/server/admin";

export async function GET() {
  try {
    const admin = await requireAdmin();
    return ok(
      {
        id: admin.id,
        email: admin.email,
        role: admin.role
      },
      { status: 200 }
    );
  } catch (error) {
    return errorResponse(error);
  }
}
