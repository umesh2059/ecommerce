import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sessionCookieOptions, issueSession } from "@/lib/auth";
import { normalizeEmail } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { email, password } = body;

    // 1. Validate input
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required",
        },
        { status: 400 }
      );
    }

    // 2. Find user
    const user = await prisma.user.findUnique({
      where: {
        email: normalizeEmail(email),
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // 3. Compare password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // 4. Create JWT + persist server-side session so logout can revoke it
    const token = await issueSession(user.id, user.role);

    // 5. Create response
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    // 6. Store JWT in HTTP-only cookie
    response.cookies.set("token", token, sessionCookieOptions());

    return response;
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Login failed",
      },
      { status: 500 }
    );
  }
}