# API Documentation - Server Actions

This document describes all the server-side functions available in the Image Gallery Manager.

## Overview

The application uses **Next.js Server Actions** for all database operations. These are TypeScript functions that execute on the server and can be safely called from client components.

All server actions are defined in `src/app/actions.ts`.

## Server Actions

### createImage

Creates a new image in the database.

**Signature:**
```typescript
export async function createImage(data: {
  url: string;
  title: string;
  description?: string;
}): Promise<Image>
```

**Parameters:**
- `url` (string, required): Valid image URL (https)
- `title` (string, required): Image title
- `description` (string, optional): Image description

**Returns:**
```typescript
{
  id: string;
  url: string;
  title: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

**Usage:**
```typescript
const image = await createImage({
  url: "https://example.com/image.jpg",
  title: "My Image",
  description: "A beautiful image"
});
```

**Error Handling:**
- Throws error if URL is invalid
- Throws error if title is empty
- Throws error if database operation fails

**Side Effects:**
- Revalidates the gallery page (/)
- Updates the UI in real-time

---

### updateImage

Updates an existing image in the database.

**Signature:**
```typescript
export async function updateImage(
  id: string,
  data: { url?: string; title?: string; description?: string }
): Promise<Image>
```

**Parameters:**
- `id` (string, required): Image ID (from database)
- `data` (object): Fields to update
  - `url` (string, optional): New image URL
  - `title` (string, optional): New title
  - `description` (string, optional): New description

**Returns:**
Updated image object (same structure as createImage)

**Usage:**
```typescript
const updated = await updateImage("clv123abc...", {
  title: "Updated Title",
  description: "New description"
});
```

**Error Handling:**
- Throws error if image ID doesn't exist
- Throws error if database operation fails

**Side Effects:**
- Revalidates the gallery page (/)
- Revalidates the image details page (/image/[id])
- Updates the UI in real-time

---

### deleteImage

Deletes an image from the database.

**Signature:**
```typescript
export async function deleteImage(id: string): Promise<{ success: boolean }>
```

**Parameters:**
- `id` (string, required): Image ID to delete

**Returns:**
```typescript
{ success: true }
```

**Usage:**
```typescript
await deleteImage("clv123abc...");
```

**Error Handling:**
- Throws error if image ID doesn't exist
- Throws error if database operation fails

**Side Effects:**
- Revalidates the gallery page (/)
- Removes the image from the UI immediately

---

### getImage

Retrieves a single image by ID.

**Signature:**
```typescript
export async function getImage(id: string): Promise<Image | null>
```

**Parameters:**
- `id` (string, required): Image ID to retrieve

**Returns:**
```typescript
{
  id: string;
  url: string;
  title: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
} | null
```

**Usage:**
```typescript
const image = await getImage("clv123abc...");
if (!image) {
  console.log("Image not found");
}
```

**Error Handling:**
- Returns `null` if image doesn't exist
- Throws error if database operation fails

**Side Effects:**
- None (read-only operation)

---

### getAllImages

Retrieves all images with optional search and sorting.

**Signature:**
```typescript
export async function getAllImages(
  searchQuery?: string,
  sortBy?: "newest" | "oldest"
): Promise<Image[]>
```

**Parameters:**
- `searchQuery` (string, optional): Search term (searches title and description)
- `sortBy` (string, optional): Sort order
  - `"newest"` (default): Most recent first
  - `"oldest"`: Oldest first

**Returns:**
Array of image objects

**Usage:**
```typescript
// Get all images
const allImages = await getAllImages();

// Search images
const results = await getAllImages("mountain");

// Sort by oldest
const oldestFirst = await getAllImages("", "oldest");

// Search and sort
const filtered = await getAllImages("sunset", "newest");
```

**Error Handling:**
- Returns empty array if no images found
- Throws error if database operation fails

**Search Behavior:**
- Case-sensitive (for SQLite compatibility)
- Searches both title and description fields
- Uses partial matching (contains)

**Side Effects:**
- None (read-only operation)

---

## Database Schema

### Image Model

```prisma
model Image {
  id          String   @id @default(cuid())
  url         String
  title       String
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

**Fields:**
- `id`: Unique identifier (automatically generated UUID)
- `url`: Image URL (required)
- `title`: Image title (required)
- `description`: Optional description text
- `createdAt`: Timestamp when image was created (auto-set)
- `updatedAt`: Timestamp of last update (auto-updated)

---

## Error Handling

All server actions include error handling:

```typescript
try {
  await createImage({ url, title, description });
  toast.success("Image added successfully!");
} catch (error) {
  toast.error("Failed to add image");
  console.error(error);
}
```

**Common Errors:**
- `PrismaClientKnownRequestError`: Database constraint violation
- `Error`: Validation error or database connection error

---

## Data Validation

### Client-Side Validation

The client performs validation before calling server actions:

```typescript
// URL validation
const isValidUrl = (urlString: string): boolean => {
  try {
    new URL(urlString);
    return true;
  } catch {
    return false;
  }
};

// Required fields
if (!formData.url.trim()) {
  setUrlError("URL is required");
  return;
}

if (!formData.title.trim()) {
  toast.error("Title is required");
  return;
}
```

### Server-Side Validation

The server actions trust the client but include safeguards in the database schema.

---

## Performance Considerations

### Revalidation
- `revalidatePath("/")` - Updates the gallery page
- `revalidatePath("/image/[id]")` - Updates image details page

This ensures the UI stays in sync with the database.

### Search Performance
- Search is performed in the database (not in-memory)
- Results are filtered server-side
- Use `searchQuery` parameter for efficiency

### Query Optimization
- Prisma automatically selects only needed fields
- Database indexes help with search performance

---

## Type Definitions

All types are automatically generated by Prisma from the schema.

```typescript
import { Image } from "@prisma/client";

type CreateImageInput = {
  url: string;
  title: string;
  description?: string;
};

type UpdateImageInput = Partial<Omit<Image, "id" | "createdAt" | "updatedAt">>;
```

---

## Integration Examples

### Adding an Image from a Form

```typescript
"use client";

import { createImage } from "@/app/actions";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AddImageForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      await createImage({
        url: formData.get("url") as string,
        title: formData.get("title") as string,
        description: formData.get("description") as string,
      });
      
      toast.success("Image added!");
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error("Failed to add image");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="url" placeholder="Image URL" required />
      <input name="title" placeholder="Title" required />
      <textarea name="description" placeholder="Description" />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Adding..." : "Add Image"}
      </button>
    </form>
  );
}
```

### Displaying Search Results

```typescript
"use client";

import { getAllImages } from "@/app/actions";
import { useEffect, useState } from "react";

export default function SearchResults() {
  const [query, setQuery] = useState("");
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await getAllImages(query);
        setImages(results);
      } finally {
        setIsLoading(false);
      }
    }, 300); // Debounce

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search images..."
      />
      {isLoading && <p>Loading...</p>}
      <div className="gallery">
        {images.map((img) => (
          <ImageCard key={img.id} {...img} />
        ))}
      </div>
    </div>
  );
}
```

---

## Best Practices

1. **Always validate input** on the client before sending to server
2. **Handle errors gracefully** with try-catch blocks
3. **Show loading states** while operations are in progress
4. **Provide user feedback** with toast notifications
5. **Revalidate pages** after mutations to keep UI in sync
6. **Use typing** with Prisma generated types for type safety

---

## Debugging

### Enable Prisma Logging

In `src/lib/prisma.ts`:

```typescript
new PrismaClient({
  log: ["query", "error", "warn"],
})
```

This logs all database queries to the console.

### View Database

```bash
npx prisma studio
```

Opens interactive database viewer at http://localhost:5555

### Check Database File

```bash
# View database stats
ls -lh dev.db

# Backup database
cp dev.db dev.db.backup
```

---

## FAQ

**Q: Can I call these server actions from the server?**
A: Yes, you can import and call them from other server components or API routes.

**Q: Are these functions secure?**
A: Yes, they execute on the server with proper validation and error handling.

**Q: Can I modify the schema?**
A: Yes, edit `prisma/schema.prisma` and run `npx prisma migrate dev`.

**Q: How do I add more fields?**
A: Update the Image model in schema.prisma, create a migration, and regenerate types.

**Q: Can I add authentication?**
A: Yes, you can add middleware to check user permissions before executing actions.

---

For more information, see [README.md](./README.md) and [SETUP_GUIDE.md](./SETUP_GUIDE.md).
