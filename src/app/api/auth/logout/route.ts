import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getCurrentUser, revokeSession } from "@/lib/auth";

export async function POST() {
  try {
    const user = await getCurrentUser();

    // Revoke the server-side session before clearing the cookie so the JWT
    // cannot be used again once the user has logged out.
    if (user?.jti) {
      await revokeSession(user.jti);
    }

    (await cookies()).delete("token");

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("LOGOUT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Logout failed",
      },
      { status: 500 }
    );
  }
}