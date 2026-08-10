import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sessionCookieOptions, issueSession } from "@/lib/auth";
import {
  normalizeEmail,
  isValidEmail,
  isValidPassword,
  PASSWORD_MIN_LENGTH,
} from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, email, password } = body;

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, email and password are required",
        },
        { status: 400 }
      );
    }

    if (typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        {
          success: false,
          message: "Name must be at least 2 characters",
        },
        { status: 400 }
      );
    }

    if (typeof email !== "string" || !isValidEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a valid email address",
        },
        { status: 400 }
      );
    }

    if (typeof password !== "string" || !isValidPassword(password)) {
      return NextResponse.json(
        {
          success: false,
          message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
        },
        { status: 400 }
      );
    }

    // Normalize to avoid case-sensitive duplicate accounts
    const normalizedEmail = normalizeEmail(email);

    // Check existing user
    const existingUser = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User already exists",
        },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
      },
    });

    // Auto-login: sign a JWT and store it in an HTTP-only cookie so the
    // user does not have to sign in right after registering. A server-side
    // session is persisted so logout can revoke it.
    const token = await issueSession(user.id, user.role);

    const response = NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );

    response.cookies.set("token", token, sessionCookieOptions());

    return response;
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to register user",
      },
      { status: 500 }
    );
  }
}