import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

type TokenPayload = {
  userId: string;
  role: "USER" | "ADMIN";
  jti: string;
};

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return secret;
}

export async function issueSession(
  userId: string,
  role: TokenPayload["role"]
): Promise<string> {
  const jti = randomUUID();

  const token = jwt.sign(
    {
      userId,
      role,
      jti,
    },
    getJwtSecret(),
    {
      expiresIn: SESSION_TTL_SECONDS,
    }
  );

  await prisma.session.create({
    data: {
      jti,
      userId,
      expiresAt: new Date(Date.now() + SESSION_TTL_SECONDS * 1000),
    },
  });

  return token;
}

export async function revokeSession(jti: string): Promise<void> {
  await prisma.session.updateMany({
    where: {
      jti,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  };
}

export async function getCurrentUser(): Promise<TokenPayload | null> {
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret()) as TokenPayload;

    // Reject sessions that were revoked (e.g. after logout) so an old or
    // stolen token cannot keep authenticating for its full 7-day lifetime.
    const session = await prisma.session.findUnique({
      where: {
        jti: decoded.jti,
      },
      select: {
        revokedAt: true,
      },
    });

    if (!session || session.revokedAt) {
      return null;
    }

    return decoded;
  } catch (error) {
    console.error("JWT verification failed:", error);

    return null;
  }
}

// Fetch the full, up-to-date user record from the database so expired accounts
// and changed roles are reflected immediately (the JWT role claim alone can
// become stale for the duration of the cookie lifetime).
export async function getSession() {
  const decoded = await getCurrentUser();

  if (!decoded) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: decoded.userId,
    },
  });

  return user;
}

type GuardResult =
  | { user: NonNullable<Awaited<ReturnType<typeof getSession>>>; response: null }
  | { user: null; response: NextResponse };

export async function requireAuth(): Promise<GuardResult> {
  const user = await getSession();

  if (!user) {
    return {
      user: null,
      response: NextResponse.json(
        {
          success: false,
          message: "Unauthorized. Please log in.",
        },
        { status: 401 }
      ),
    };
  }

  return { user, response: null };
}

export async function requireAdmin(): Promise<GuardResult> {
  const result = await requireAuth();

  if (result.response) {
    return result;
  }

  if (result.user.role !== "ADMIN") {
    return {
      user: null,
      response: NextResponse.json(
        {
          success: false,
          message: "Forbidden. Admin access required.",
        },
        { status: 403 }
      ),
    };
  }

  return result;
}