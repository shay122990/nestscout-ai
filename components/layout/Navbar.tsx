"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Role = "USER" | "AGENT" | null;

export default function Navbar() {
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  async function fetchRoleForUser(authUserId: string | null) {
    setLoading(true);

    if (!authUserId) {
      setRole(null);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authUserId }),
      });

      if (res.ok) {
        const json = await res.json();
        setRole(json.user?.role ?? "USER");
      } else {
        setRole("USER");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;

    //  Initial load
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!active) return;
      await fetchRoleForUser(data.user?.id ?? null);
    })();

    //  React to login / logout events
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!active) return;

      if (event === "SIGNED_OUT") {
        setRole(null);
        setLoading(false);
        return;
      }

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        await fetchRoleForUser(session?.user?.id ?? null);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <header className="border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          NestScout<span className="text-blue-600">AI</span>
        </Link>

        <nav className="flex items-center gap-4 text-sm text-neutral-600">
          <Link href="/" className="hover:text-neutral-900">
            Home
          </Link>

          <Link href="/listings" className="hover:text-neutral-900">
            Listings
          </Link>

          {!loading && role === null && (
            <Link href="/login" className="hover:text-neutral-900">
              Login
            </Link>
          )}

          {!loading && role === "USER" && (
            <Link href="/profile" className="hover:text-neutral-900">
              Profile
            </Link>
          )}

          {!loading && role === "AGENT" && (
            <Link href="/dashboard" className="hover:text-neutral-900">
              Dashboard
            </Link>
          )}

          {!loading && role !== null && (
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
