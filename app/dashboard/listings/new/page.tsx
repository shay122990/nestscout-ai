import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function createListing(formData: FormData) {
  "use server";

  const title = String(formData.get("title") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const price = Number(formData.get("price") || 0);
  const propertyType = String(formData.get("propertyType") || "").trim();
  const bedrooms = Number(formData.get("bedrooms") || 0);
  const bathrooms = Number(formData.get("bathrooms") || 0);
  const areaSqm = Number(formData.get("areaSqm") || 0);
  const city = String(formData.get("city") || "").trim();
  const neighborhood = String(formData.get("neighborhood") || "").trim();
  const address = String(formData.get("address") || "").trim();
  const imageUrl = String(formData.get("imageUrl") || "").trim();

  if (!title || !slug || !description || !city || !neighborhood) {
    throw new Error("Missing required fields");
  }

  const agent = await prisma.user.upsert({
    where: { email: "agent@nestscout.ai" },
    update: {},
    create: {
      email: "agent@nestscout.ai",
      name: "NestScout Agent",
      role: "AGENT",
    },
  });

  await prisma.listing.create({
    data: {
      title,
      slug,
      description,
      price,
      currency: "AED",
      propertyType,
      bedrooms,
      bathrooms,
      areaSqm,
      city,
      neighborhood,
      address,
      amenities: [], // you can add a multi-select later
      images: imageUrl ? [imageUrl] : [],
      agentId: agent.id,
    },
  });

  // Revalidate pages that depend on listings
  revalidatePath("/listings");
  revalidatePath("/dashboard");

  redirect("/dashboard");
}

export default function NewListingPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">New Listing</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Create a property listing. This will be saved in Supabase and shown on
        the public site.
      </p>

      <form action={createListing} className="mt-6 space-y-4 text-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-1">
            Title
            <input
              name="title"
              className="rounded-md border px-3 py-2"
              placeholder="Bright 2BR in Dubai Marina"
              required
            />
          </label>

          <label className="flex flex-col gap-1">
            Slug
            <input
              name="slug"
              className="rounded-md border px-3 py-2"
              placeholder="bright-2br-dubai-marina"
              required
            />
          </label>
        </div>

        <label className="flex flex-col gap-1">
          Description
          <textarea
            name="description"
            className="min-h-[100px] rounded-md border px-3 py-2"
            placeholder="Describe the property, view, interior, and community."
            required
          />
        </label>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="flex flex-col gap-1">
            Price (AED)
            <input
              type="number"
              name="price"
              className="rounded-md border px-3 py-2"
              required
            />
          </label>

          <label className="flex flex-col gap-1">
            Bedrooms
            <input
              type="number"
              name="bedrooms"
              className="rounded-md border px-3 py-2"
              required
            />
          </label>

          <label className="flex flex-col gap-1">
            Bathrooms
            <input
              type="number"
              name="bathrooms"
              className="rounded-md border px-3 py-2"
              required
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-1">
            Area (m²)
            <input
              type="number"
              name="areaSqm"
              className="rounded-md border px-3 py-2"
              required
            />
          </label>

          <label className="flex flex-col gap-1">
            Property type
            <input
              name="propertyType"
              className="rounded-md border px-3 py-2"
              placeholder="apartment, villa, penthouse..."
              required
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="flex flex-col gap-1">
            City
            <input
              name="city"
              className="rounded-md border px-3 py-2"
              placeholder="Dubai"
              required
            />
          </label>

          <label className="flex flex-col gap-1">
            Neighborhood
            <input
              name="neighborhood"
              className="rounded-md border px-3 py-2"
              placeholder="Dubai Marina"
              required
            />
          </label>

          <label className="flex flex-col gap-1">
            Address
            <input
              name="address"
              className="rounded-md border px-3 py-2"
              placeholder="Dubai Marina Walk"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1">
          Main image URL
          <input
            name="imageUrl"
            className="rounded-md border px-3 py-2"
            placeholder="https://..."
          />
        </label>

        <button
          type="submit"
          className="mt-4 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          Create listing
        </button>
      </form>
    </main>
  );
}
