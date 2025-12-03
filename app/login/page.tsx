"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Mode = "login" | "signup";
type Role = "USER" | "AGENT";

type UserMetadata = {
  full_name?: string;
};

function getUserFullName(userMetadata: unknown): string | null {
  if (
    userMetadata &&
    typeof userMetadata === "object" &&
    "full_name" in userMetadata &&
    typeof (userMetadata as { full_name: unknown }).full_name === "string"
  ) {
    return (userMetadata as { full_name: string }).full_name;
  }
  return null;
}

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function syncUser(params: {
    authUserId: string;
    email: string;
    name: string | null;
  }): Promise<Role> {
    const res = await fetch("/api/auth/sync-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const json = await res.json().catch(() => null);
      console.error("sync-user failed", json);
      throw new Error("Could not sync user");
    }

    const json = await res.json();
    return (json.user?.role as Role) ?? "USER";
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "login") {
        const { data, error: supabaseError } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });

        if (supabaseError || !data.user) {
          setError(supabaseError?.message ?? "Login failed");
          return;
        }

        const user = data.user;
        const metadataName = getUserFullName(
          user.user_metadata as UserMetadata
        );

        const role = await syncUser({
          authUserId: user.id,
          email: user.email ?? "",
          name: metadataName,
        });

        if (role === "AGENT") {
          router.push("/dashboard");
        } else {
          router.push("/profile");
        }
      } else {
        const { data, error: supabaseError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName || null,
            },
          },
        });

        if (supabaseError) {
          setError(supabaseError.message);
          return;
        }

        if (!data.user) {
          setError(
            "Account created. Please check your email to confirm, then log in."
          );
          return;
        }

        const user = data.user;

        await syncUser({
          authUserId: user.id,
          email: user.email ?? "",
          name: fullName || null,
        });

        if (!data.session) {
          setError(
            "Account created. Please check your email to confirm, then log in."
          );
          return;
        }

        router.push("/profile");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-md mx-auto py-12 px-4">
      <div className="mb-6 flex justify-center gap-4">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`px-4 py-2 rounded-full text-sm border transition ${
            mode === "login"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-neutral-700 border-neutral-300"
          }`}
        >
          Log in
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`px-4 py-2 rounded-full text-sm border transition ${
            mode === "signup"
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-neutral-700 border-neutral-300"
          }`}
        >
          Create account
        </button>
      </div>

      <h1 className="text-2xl font-semibold mb-4">
        {mode === "login" ? "Welcome back" : "Create your NestScout account"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "signup" && (
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            placeholder="Full name (optional)"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        )}

        <input
          type="email"
          className="w-full border rounded px-3 py-2"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full border rounded px-3 py-2"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-60"
          disabled={loading}
        >
          {loading
            ? mode === "login"
              ? "Logging in..."
              : "Creating account..."
            : mode === "login"
            ? "Log in"
            : "Sign up"}
        </button>
      </form>
    </main>
  );
}
