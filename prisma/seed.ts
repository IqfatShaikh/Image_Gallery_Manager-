import { prisma } from "@/lib/prisma";

async function main() {
  // Clear existing data
  await prisma.image.deleteMany({});

  // Create sample images
  const images = await prisma.image.createMany({
    data: [
      {
        title: "Mountain Landscape",
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
        description:
          "Beautiful mountain landscape with snow-capped peaks and clear blue sky. Perfect for nature lovers.",
      },
      {
        title: "Ocean Sunset",
        url: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800",
        description:
          "Breathtaking sunset over the ocean with golden and orange hues reflecting on the water.",
      },
      {
        title: "Forest Path",
        url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
        description:
          "A serene forest path lined with tall trees, creating a natural tunnel of greenery.",
      },
      {
        title: "Desert Dunes",
        url: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800",
        description:
          "Golden sand dunes in the desert under a clear sky, showing the vastness of nature.",
      },
      {
        title: "Northern Lights",
        url: "https://images.unsplash.com/photo-1579033100-bca569e5ae67?w=800",
        description:
          "Spectacular display of the Aurora Borealis dancing across the night sky in vibrant green and purple colors.",
      },
      {
        title: "City Skyline",
        url: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800",
        description:
          "Modern city skyline at night with illuminated skyscrapers and busy streets full of life.",
      },
    ],
  });

  console.log(`Successfully created ${images.count} sample images`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
