# Image Gallery Manager

A modern, fully-featured image gallery management application built with **Next.js 16** (App Router), **TypeScript**, **Tailwind CSS**, and **Prisma** with **SQLite**.

## 🎯 Features

### Core Features
- 📸 **Add Images** - Add images by URL with title and description
- 🖼️ **Gallery Display** - Responsive grid layout showing all images
- ✏️ **Edit Images** - Update image URL, title, and description
- 🗑️ **Delete Images** - Remove images with confirmation dialog
- 🔍 **Search** - Search images by title or description
- 📅 **Filter by Date** - Sort by newest or oldest first
- 🔗 **Image Details** - Click on any image to view full details page
- ⚠️ **Error Handling** - Graceful handling of broken image URLs with fallback UI
- ⏳ **Loading States** - Skeleton loaders and spinning indicators
- 🔔 **Toast Notifications** - User-friendly notifications for all actions
- 🌈 **Beautiful UI** - Modern design with Tailwind CSS

## 📦 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: SQLite with Prisma ORM
- **Notifications**: React Hot Toast
- **Package Manager**: npm

## 📁 Project Structure

\\\
image-gallery/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Gallery homepage
│   │   ├── layout.tsx               # Root layout with ToastProvider
│   │   ├── actions.ts               # Server actions for CRUD operations
│   │   ├── not-found.tsx            # 404 page
│   │   ├── add/page.tsx             # Add new image page
│   │   ├── edit/[id]/page.tsx       # Edit image page
│   │   ├── image/[id]/page.tsx      # Image details page
│   │   └── globals.css              # Global styles
│   ├── components/
│   │   ├── ImageCard.tsx            # Image preview card
│   │   ├── ImageForm.tsx            # Form for add/edit
│   │   └── ToastProvider.tsx        # Toast notification setup
│   └── lib/
│       └── prisma.ts                # Prisma client
├── prisma/
│   ├── schema.prisma                # Database schema
│   ├── migrations/                  # Database migrations
│   └── seed.ts                      # Sample data seeder
└── package.json
\\\

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Install dependencies:**
   \\\ash
   npm install
   \\\

2. **Set up the database:**
   \\\ash
   npx prisma migrate dev --name init
   \\\

3. **Seed sample data (optional):**
   \\\ash
   npm run prisma:seed
   \\\

4. **Start development server:**
   \\\ash
   npm run dev
   \\\

5. **Open in browser:**
   \\\
   http://localhost:3000
   \\\

## 📝 Available Scripts

\\\ash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run prisma:seed  # Seed database with sample data
\\\

## 💡 Usage Guide

### Add an Image
1. Click **"+ Add New Image"**
2. Enter image URL, title, and optional description
3. Click **"Add Image"**

### View Image Details
1. Click on any image in the gallery
2. View full-size image and all metadata

### Edit an Image
1. Click **"Edit"** button on image card or details page
2. Modify any fields
3. Click **"Update Image"**

### Delete an Image
1. Click **"Delete"** button
2. Confirm deletion
3. Image is removed immediately

### Search Images
1. Type in search bar to filter by title or description
2. Results update in real-time

### Sort Images
1. Use **"Sort By"** dropdown
2. Choose "Newest First" or "Oldest First"

## 🗄️ Database

### Prisma Schema

\\\prisma
model Image {
  id          String   @id @default(cuid())
  url         String
  title       String
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
\\\

### Database Commands

\\\ash
# Create new migration
npx prisma migrate dev --name migration_name

# View database GUI
npx prisma studio

# Reset database
rm dev.db
npx prisma migrate dev --name init
\\\

## 🔧 Server Actions (API)

All database operations are handled via Next.js Server Actions:

- **createImage(data)** - Add a new image
- **updateImage(id, data)** - Update an existing image
- **deleteImage(id)** - Delete an image
- **getAllImages(searchQuery?, sortBy?)** - Get all images with search/sort
- **getImage(id)** - Get a single image by ID

## 🎨 Customization

### Tailwind CSS
- Modify styles in individual components
- Update global styles in src/app/globals.css
- Configure theme in 	ailwind.config.ts

### Database
- Edit prisma/schema.prisma to add fields
- Run 
px prisma migrate dev to apply changes
- Update prisma/seed.ts for sample data

## 🐛 Troubleshooting

### Database Issues
\\\ash
# Clear database cache
rm dev.db

# Recreate tables
npx prisma migrate dev --name init

# Reseed data
npm run prisma:seed
\\\

### Build Errors
\\\ash
# Clear cache
rm -rf .next

# Reinstall dependencies
npm install

# Rebuild
npm run build
\\\

## 📤 Deployment

### Vercel (Recommended)
\\\ash
npm install -g vercel
vercel
\\\

### Other Platforms
1. Build: \
pm run build\
2. Start: \
pm start\
3. Ensure DATABASE_URL is set in environment

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com)

---

**Happy image managing! 🎉**
