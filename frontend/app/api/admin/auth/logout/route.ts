import { errorResponse } from "@/lib/server/http";
import { requireAdmin } from "@/lib/server/admin";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await requireAdmin();

    const response = NextResponse.json({ success: true, message: "Logged out." }, { status: 200 });
    response.cookies.set("admin_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      expires: new Date(0)
    });

    return response;
  } catch (error) {
    return errorResponse(error);
  }
}
