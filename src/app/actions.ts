"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createImage(data: {
  url: string;
  title: string;
  description?: string;
}) {
  try {
    const image = await prisma.image.create({
      data: {
        url: data.url,
        title: data.title,
        description: data.description || null,
      },
    });

    revalidatePath("/");
    return image;
  } catch (error) {
    console.error("Error creating image:", error);
    throw new Error("Failed to create image");
  }
}

export async function updateImage(
  id: string,
  data: { url?: string; title?: string; description?: string }
) {
  try {
    const image = await prisma.image.update({
      where: { id },
      data: {
        ...(data.url && { url: data.url }),
        ...(data.title && { title: data.title }),
        ...(data.description !== undefined && { description: data.description || null }),
      },
    });

    revalidatePath("/");
    revalidatePath(`/image/${id}`);
    return image;
  } catch (error) {
    console.error("Error updating image:", error);
    throw new Error("Failed to update image");
  }
}

export async function deleteImage(id: string) {
  try {
    await prisma.image.delete({
      where: { id },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting image:", error);
    throw new Error("Failed to delete image");
  }
}

export async function getImage(id: string) {
  try {
    const image = await prisma.image.findUnique({
      where: { id },
    });

    return image;
  } catch (error) {
    console.error("Error fetching image:", error);
    throw new Error("Failed to fetch image");
  }
}

export async function getAllImages(
  searchQuery?: string,
  sortBy: "newest" | "oldest" | "title" = "newest"
) {
  try {
    const images = await prisma.image.findMany({
      where: searchQuery
        ? {
            OR: [
              {
                title: {
                  contains: searchQuery,
                },
              },
              {
                description: {
                  contains: searchQuery,
                },
              },
            ],
          }
        : undefined,
      orderBy: sortBy === "title" ? { title: "asc" } : { createdAt: sortBy === "newest" ? "desc" : "asc" },
    });

    return images;
  } catch (error) {
    console.error("Error fetching images:", error);
    throw new Error("Failed to fetch images");
  }
}
