"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

type UserRole = "USER" | "AGENT";

type ApiListing = {
  id: string;
  slug: string;
  title: string;
  city: string;
  neighborhood: string;
  currency: string;
  price: number;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  areaSqm: number;
  images: string[];
};

type ApiFavorite = {
  id: string;
  createdAt: string;
  listing: ApiListing;
};

type ApiUser = {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  createdAt: string;
  favorites: ApiFavorite[];
};

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      //  Check Supabase auth on client
      const { data } = await supabase.auth.getUser();
      const authUser = data.user;

      if (!authUser) {
        if (!cancelled) {
          router.replace("/login");
        }
        return;
      }

      //  Fetch Prisma user + favorites by authUserId
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authUserId: authUser.id }),
      });

      if (!res.ok) {
        if (!cancelled) {
          setError("Unable to load profile. Please try again.");
          setLoading(false);
        }
        return;
      }

      const json = (await res.json()) as { user: ApiUser | null };

      if (!json.user) {
        // No Prisma user – treat as unauthenticated in the app
        if (!cancelled) {
          router.replace("/login");
        }
        return;
      }

      if (json.user.role === "AGENT") {
        if (!cancelled) {
          router.replace("/dashboard");
        }
        return;
      }

      if (!cancelled) {
        setProfile(json.user);
        setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <p className="text-sm text-neutral-600">Loading profile…</p>
      </main>
    );
  }

  if (error || !profile) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <p className="mb-4 text-sm text-red-600">
          {error ?? "Could not load profile."}
        </p>
        <button
          type="button"
          onClick={() => router.replace("/login")}
          className="text-sm text-blue-600 hover:underline"
        >
          Go to login
        </button>
      </main>
    );
  }

  const memberSince = new Date(profile.createdAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const favoritesSorted = [...profile.favorites].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <section className="mb-10 rounded-lg border bg-white/80 p-6 shadow-sm">
        <h1 className="mb-4 text-2xl font-semibold">My account</h1>

        <div className="space-y-2 text-sm text-neutral-700">
          <p>
            <span className="font-medium text-neutral-900">Name: </span>
            {profile.name ?? "No name set"}
          </p>
          <p>
            <span className="font-medium text-neutral-900">Email: </span>
            {profile.email}
          </p>
          <p>
            <span className="font-medium text-neutral-900">Member since: </span>
            {memberSince}
          </p>
          <p>
            <span className="font-medium text-neutral-900">Role: </span>
            Regular user
          </p>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Saved listings</h2>
          <Link
            href="/listings"
            className="text-sm text-blue-600 hover:underline"
          >
            Browse more homes
          </Link>
        </div>

        {favoritesSorted.length === 0 ? (
          <p className="text-sm text-neutral-600">
            You don&apos;t have any saved listings yet. Start exploring{" "}
            <Link href="/listings" className="text-blue-600 hover:underline">
              listings
            </Link>{" "}
            and tap the save button to keep your favourites here.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favoritesSorted.map((fav) => {
              const listing = fav.listing;

              return (
                <Link
                  key={fav.id}
                  href={`/listings/${listing.slug}`}
                  className="group flex flex-col overflow-hidden rounded-lg border bg-white/80 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  {listing.images[0] ? (
                    <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-100">
                      <Image
                        src={listing.images[0]}
                        alt={listing.title}
                        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[4/3] w-full bg-neutral-100" />
                  )}

                  <div className="flex flex-1 flex-col gap-2 p-3 text-sm">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="line-clamp-2 text-sm font-semibold text-neutral-900">
                        {listing.title}
                      </h3>
                      <span className="shrink-0 text-xs font-medium text-blue-600">
                        {listing.currency}{" "}
                        {listing.price.toLocaleString("en-US")}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-600">
                      {listing.city} • {listing.neighborhood}
                    </p>

                    <p className="text-xs text-neutral-600">
                      {listing.bedrooms} bd • {listing.bathrooms} ba •{" "}
                      {listing.areaSqm} m² • {listing.propertyType}
                    </p>

                    <div className="mt-auto flex items-center justify-between pt-1 text-xs text-neutral-500">
                      <span>
                        Saved on{" "}
                        {new Date(fav.createdAt).toLocaleDateString("en-GB")}
                      </span>
                      <span className="text-blue-600 group-hover:underline">
                        View details
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
