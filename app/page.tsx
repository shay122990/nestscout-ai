import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-12 px-4 pb-16 pt-12 md:flex-row md:items-center">
      <section className="md:w-1/2">
        <div className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
          AI-powered real estate search
        </div>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
          Find your next home
          <span className="block text-blue-600">with NestScout AI.</span>
        </h1>

        <p className="mt-4 text-sm leading-relaxed text-neutral-600 sm:text-base">
          Browse curated properties and let AI help you understand each listing,
          the neighborhood, and whether it fits your lifestyle, budget, and
          commute.
        </p>

        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            href="/listings"
            className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            Browse listings
          </Link>

          <Link
            href="/ai-finder"
            className="rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-700 hover:border-neutral-500"
          >
            Try AI home finder
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap gap-4 text-xs text-neutral-500">
          <span>✓ Smart summaries for each property</span>
          <span>✓ Neighborhood insights</span>
          <span>✓ Shortlists based on your preferences</span>
        </div>
      </section>

      {/* Right side – simple mock “card” preview */}
      <section className="md:w-1/2">
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="mb-3 text-xs font-medium uppercase tracking-wide text-neutral-500">
            Featured listing
          </div>

          <div className="overflow-hidden rounded-xl bg-neutral-200">
            {/* will be an image */}
            <div className="aspect-[4/3] bg-gradient-to-tr from-blue-500/40 via-purple-500/40 to-amber-500/40" />
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-blue-600">
                  Bright 2BR in Dubai Marina
                </p>
                <p className="text-xs text-neutral-500">Dubai Marina · Dubai</p>
              </div>
              <p className="text-right text-sm font-semibold text-blue-500">
                8,500 <span className="text-xs font-normal">AED / month</span>
              </p>
            </div>

            <p className="text-xs text-neutral-600">
              “AI: Ideal for young professionals who want a waterfront lifestyle
              with quick access to the metro and business districts.”
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
