import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const listings = await prisma.listing.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Manage your listings. This is your author/admin area.
          </p>
        </div>

        <Link
          href="/dashboard/listings/new"
          className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + New listing
        </Link>
      </div>

      {listings.length === 0 ? (
        <p className="text-sm text-neutral-500">
          No listings yet. Create your first property to start populating the
          site.
        </p>
      ) : (
        <div className="space-y-3 text-sm">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="flex items-center justify-between rounded-lg border bg-white px-4 py-3"
            >
              <div>
                <p className="font-medium">{listing.title}</p>
                <p className="text-xs text-neutral-500">
                  {listing.neighborhood}, {listing.city} ·{" "}
                  {listing.price.toLocaleString("en-AE")} {listing.currency}
                </p>
              </div>
              <Link
                href={`/listings/${listing.slug}`}
                className="text-xs font-medium text-blue-600 hover:underline"
              >
                View
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
