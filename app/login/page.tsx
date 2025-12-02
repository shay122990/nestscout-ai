"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error: supabaseError } =
      await supabase.auth.signInWithPassword({ email, password });

    if (supabaseError || !data.user) {
      setError(supabaseError?.message ?? "Login failed");
      setLoading(false);
      return;
    }

    const user = data.user;

    // Sync user into Prisma and get role back
    const res = await fetch("/api/auth/sync-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        authUserId: user.id,
        email: user.email,
        name: user.user_metadata?.full_name ?? null,
      }),
    });

    if (!res.ok) {
      const json = await res.json().catch(() => null);
      console.error("sync-user failed", json);
      setError("Could not sync user");
      setLoading(false);
      return;
    }

    const json = await res.json();
    const role = json.user?.role as "USER" | "AGENT" | "ADMIN" | undefined;

    if (role === "AGENT" || role === "ADMIN") {
      router.push("/dashboard");
    } else {
      router.push("/profile");
    }

    setLoading(false);
  }

  return (
    <main className="max-w-md mx-auto py-12 px-4">
      <h1 className="text-2xl font-semibold mb-6">Login</h1>

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          className="w-full border rounded px-3 py-2"
          placeholder="Email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full border rounded px-3 py-2"
          placeholder="Password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>
    </main>
  );
}
