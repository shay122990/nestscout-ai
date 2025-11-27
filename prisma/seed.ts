import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const agent = await prisma.user.upsert({
    where: { email: "agent@nestscout.ai" },
    update: {},
    create: {
      email: "agent@nestscout.ai",
      name: "NestScout Agent",
      role: "AGENT",
    },
  });

  const listings = [
    {
      title: "Bright 2BR Apartment in Dubai Marina",
      slug: "bright-2br-dubai-marina",
      description:
        "Modern 2-bedroom with marina views, floor-to-ceiling windows, and access to gym & pool.",
      price: 8500,
      currency: "AED",
      propertyType: "apartment",
      bedrooms: 2,
      bathrooms: 2,
      areaSqm: 112,
      city: "Dubai",
      neighborhood: "Dubai Marina",
      address: "Dubai Marina Walk",
      amenities: ["pool", "gym", "parking", "near_metro"],
      images: ["https://picsum.photos/seed/marina1/800/600"],
    },
    {
      title: "Cozy Studio in Business Bay",
      slug: "cozy-studio-business-bay",
      description:
        "Compact studio perfect for professionals. Walking distance to Business Bay metro.",
      price: 5500,
      currency: "AED",
      propertyType: "apartment",
      bedrooms: 0,
      bathrooms: 1,
      areaSqm: 44,
      city: "Dubai",
      neighborhood: "Business Bay",
      address: "Business Bay",
      amenities: ["near_metro", "parking"],
      images: ["https://picsum.photos/seed/studio1/800/600"],
    },
    {
      title: "Luxury 4BR Villa in Arabian Ranches",
      slug: "luxury-villa-arabian-ranches",
      description:
        "Spacious family villa with private garden, large living room, and community pool access.",
      price: 21000,
      currency: "AED",
      propertyType: "villa",
      bedrooms: 4,
      bathrooms: 4,
      areaSqm: 320,
      city: "Dubai",
      neighborhood: "Arabian Ranches",
      address: "Arabian Ranches 2",
      amenities: ["garden", "parking", "community_pool"],
      images: ["https://picsum.photos/seed/villa1/800/600"],
    },
  ];

  for (const listing of listings) {
    await prisma.listing.upsert({
      where: { slug: listing.slug },
      update: {},
      create: {
        ...listing,
        agentId: agent.id,
      },
    });
  }

  console.log("🌱 Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
