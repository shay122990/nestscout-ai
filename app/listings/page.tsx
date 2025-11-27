import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ListingsPage() {
  const listings = await prisma.listing.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Listings</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Explore available properties. AI enhancements (summaries, ideal-fit,
            search) will plug into this page.
          </p>
        </div>

        <div className="flex gap-2 text-xs">
          <span className="rounded-full border border-neutral-300 px-3 py-1 text-neutral-600">
            {listings.length} result{listings.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      {listings.length === 0 ? (
        <p className="text-sm text-neutral-500">
          No listings yet. Once you seed or add properties via the dashboard,
          they will appear here.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <article
              key={listing.id}
              className="flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm"
            >
              {/* Image */}
              <Link href={`/listings/${listing.slug}`} className="block">
                <div className="relative aspect-[4/3] bg-neutral-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      listing.images[0] ??
                      "https://picsum.photos/seed/fallback/800/600"
                    }
                    alt={listing.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </Link>

              {/* Content */}
              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link
                      href={`/listings/${listing.slug}`}
                      className="text-sm font-medium hover:underline"
                    >
                      {listing.title}
                    </Link>
                    <p className="mt-1 text-xs text-neutral-500">
                      {listing.neighborhood}, {listing.city}
                    </p>
                  </div>
                  <p className="text-right text-sm font-semibold">
                    {listing.price.toLocaleString("en-AE")}{" "}
                    <span className="text-xs font-normal">
                      {listing.currency}
                    </span>
                  </p>
                </div>

                <p className="mt-3 line-clamp-3 text-xs text-neutral-700">
                  {(listing.aiDescription || listing.description).slice(0, 180)}
                  …
                </p>

                <div className="mt-4 flex items-center justify-between text-xs text-neutral-500">
                  <span>
                    {listing.bedrooms} bd · {listing.bathrooms} ba ·{" "}
                    {listing.areaSqm} m²
                  </span>
                  <span className="capitalize">{listing.propertyType}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
