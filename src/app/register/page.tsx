import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata = {
  title: "Create account",
};

function safeNext(value: unknown): string {
  if (typeof value === "string" && value.startsWith("/") && !value.startsWith("//")) {
    return value;
  }

  return "/";
}

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next: rawNext } = await searchParams;
  const next = safeNext(rawNext);

  const user = await getCurrentUser();

  if (user) {
    redirect(next);
  }

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16 sm:py-24">
      <div className="w-full max-w-sm">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          myshoop
        </Link>

        <div className="mt-8 rounded-2xl border border-border p-6 sm:p-8">
          <h1 className="text-xl font-semibold tracking-tight">
            Create account
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {rawNext
              ? "Create an account to continue with your purchase."
              : "Join myshoop to start shopping."}
          </p>

          <RegisterForm next={next} />
        </div>
      </div>
    </main>
  );
}