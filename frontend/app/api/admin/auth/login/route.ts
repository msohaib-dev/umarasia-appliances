import { signAdminJwt } from "@/lib/server/jwt";
import { validateAdminCredentials } from "@/lib/server/admin-auth";
import { errorResponse, fail } from "@/lib/server/http";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body?.email;
    const password = body?.password;

    if (!email || !password) {
      return fail("email and password are required.", 400);
    }

    const admin = validateAdminCredentials(email, password);
    if (!admin) {
      return fail("Invalid credentials.", 401);
    }

    const token = signAdminJwt(admin);

    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful.",
        data: {
          id: admin.id,
          email: admin.email,
          role: admin.role
        }
      },
      { status: 200 }
    );

    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 60 * 60 * 24
    });

    return response;
  } catch (error) {
    return errorResponse(error);
  }
}
