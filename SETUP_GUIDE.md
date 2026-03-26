# Image Gallery Manager - Setup Guide

This guide provides detailed step-by-step instructions for setting up and running the Image Gallery Manager application.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation Steps](#installation-steps)
3. [Configuration](#configuration)
4. [Database Setup](#database-setup)
5. [Running the Application](#running-the-application)
6. [Sample Data](#sample-data)
7. [Verification](#verification)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18 or higher
  - Download from: https://nodejs.org/
  - Verify: `node --version`

- **npm**: Version 8 or higher (comes with Node.js)
  - Verify: `npm --version`

- **Git** (optional, for cloning the repository)
  - Download from: https://git-scm.com/

## Installation Steps

### Step 1: Navigate to Project Directory
```bash
cd path/to/image-gallery
```

### Step 2: Install Dependencies
Install all required npm packages:
```bash
npm install
```

This will install:
- Next.js 16 with Turbopack
- React 19
- TypeScript
- Prisma 5
- Tailwind CSS 4
- React Hot Toast
- ESLint and TypeScript utilities

Wait for the installation to complete. This may take 1-2 minutes.

### Step 3: Verify Installation
Check that all packages were installed correctly:
```bash
npm list --depth=0
```

You should see all the key dependencies listed without errors.

## Configuration

### Environment Variables
The project includes a `.env` file pre-configured for SQLite:

```env
DATABASE_URL="file:./dev.db"
```

**Note**: For production, you may want to change this to:
- PostgreSQL: `postgresql://user:password@localhost:5432/image-gallery`
- MySQL: `mysql://user:password@localhost:3306/image-gallery`

If you modify the DATABASE_URL, you'll need to run migrations again.

### Next.js Configuration
The application is configured in `next.config.ts`:
- React Compiler is enabled for performance
- External image hostnames are configured to accept any HTTPS source

## Database Setup

### Step 1: Initialize the Database
Run the Prisma migration to create the database schema:

```bash
npx prisma migrate dev --name init
```

This command will:
1. Create the SQLite database file (`dev.db`)
2. Create the `Image` table with required columns
3. Generate Prisma client types
4. Create migration files in `prisma/migrations/`

**Expected output:**
```
SQLite database dev.db created at file:./dev.db
Applying migration `20260326090654_init`
Your database is now in sync with your schema.
```

### Step 2: Verify Database Creation
Check that the database file was created:
```bash
ls -la dev.db
```

Or on Windows:
```bash
dir dev.db
```

The file should exist in the project root directory.

### Step 3: View Database (Optional)
You can view and edit the database using Prisma Studio:

```bash
npx prisma studio
```

This opens an interactive web interface at `http://localhost:5555` where you can:
- View all images in the database
- Add/edit/delete records manually
- Test queries

## Running the Application

### Development Server
Start the development server with hot-reload:

```bash
npm run dev
```

**Expected output:**
```
▲ Next.js 16.2.1 (Turbopack)
- Local:         http://localhost:3000
- Network:       http://192.168.x.x:3000
- Environments: .env
✓ Ready in 890ms
```

### Access the Application
Open your browser and navigate to:
```
http://localhost:3000
```

The gallery will load with sample images (if seeded).

### Production Build
To build and test the production version:

```bash
# Build
npm run build

# Start production server
npm start
```

The production server will be available at `http://localhost:3000`

### Stop the Server
Press `Ctrl + C` in the terminal to stop the development server.

## Sample Data

### Automatic Seeding
To seed the database with sample images:

```bash
npm run prisma:seed
```

This creates 6 sample images:
1. Mountain Landscape
2. Ocean Sunset
3. Forest Path
4. Desert Dunes
5. Northern Lights
6. City Skyline

### Manual Database Reset
If you want to clear the database and start fresh:

```bash
# Delete the database file
rm dev.db          # On macOS/Linux
del dev.db         # On Windows

# Recreate the database
npx prisma migrate dev --name init

# Seed with sample data
npm run prisma:seed
```

## Verification

### Checklist
Verify that everything is working correctly:

- [ ] Dependencies installed successfully (`npm install`)
- [ ] Database created (`dev.db` file exists)
- [ ] Migrations applied (`npx prisma migrate dev --name init`)
- [ ] Development server running (`npm run dev`)
- [ ] Application accessible at `http://localhost:3000`
- [ ] Gallery displays images
- [ ] Can add a new image
- [ ] Can edit an image
- [ ] Can delete an image
- [ ] Search functionality works
- [ ] Sort functionality works

### Quick Test
1. Start the dev server: `npm run dev`
2. Open browser: `http://localhost:3000`
3. Click "Add New Image"
4. Enter a valid image URL, title, and description
5. Click "Add Image"
6. Confirm the image appears in the gallery
7. Click on the image to view details
8. Click "Edit Image" and make changes
9. Click "Delete" to remove the image
10. Verify it's removed from the gallery

## Available Scripts

Here are all available npm scripts:

```bash
# Development
npm run dev                 # Start development server on port 3000

# Production
npm run build               # Build for production
npm start                   # Start production server

# Database
npx prisma migrate dev     # Create new migration
npx prisma migrate deploy  # Apply migrations in production
npx prisma studio         # Open database GUI
npm run prisma:seed       # Seed database with sample data

# Code Quality
npm run lint               # Run ESLint checks
npm run lint -- --fix      # Auto-fix lint issues
```

## Troubleshooting

### Common Issues and Solutions

#### Issue: "Database does not exist"
**Solution**: Run the migration command:
```bash
npx prisma migrate dev --name init
```

#### Issue: "Module not found" or install errors
**Solution**: Reinstall dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
```

#### Issue: Port 3000 is already in use
**Solution**: Run on a different port:
```bash
npm run dev -- -p 3001
```
Then access at: `http://localhost:3001`

#### Issue: "Cannot find module @prisma/client"
**Solution**: Generate Prisma client:
```bash
npx prisma generate
npm install
```

#### Issue: Image fails to load with "Invalid src prop"
**Solution**: The image hostname needs to be configured. The app is already configured to accept any HTTPS URL.

#### Issue: Database is locked (Windows)
**Solution**: 
- Close Prisma Studio if it's open
- Stop the development server
- Close any other processes using the database
- Try again

#### Issue: "dev.db file is corrupted"
**Solution**: Delete and recreate:
```bash
rm dev.db
npx prisma migrate dev --name init
npm run prisma:seed
```

### Getting Help

If you encounter issues not covered here:

1. **Check the logs**: Look at the terminal output for error messages
2. **Verify prerequisites**: Ensure Node.js 18+ is installed
3. **Clear cache**: 
   ```bash
   rm -rf .next
   npm run build
   ```
4. **Review configuration**: Check `.env` file is correct
5. **Check database**: Run `npx prisma studio` to inspect the database

### Running Diagnostics

To help debug issues:

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check Prisma schema
npx prisma validate

# Check if database is accessible
npx prisma db execute --stdin < /dev/null

# View all installed dependencies
npm list
```

## Next Steps

After successful setup:

1. **Customize the design**: Edit Tailwind CSS classes in components
2. **Add more fields**: Modify `prisma/schema.prisma` and run migrations
3. **Deploy**: Follow deployment guides for Vercel, AWS, or your platform
4. **Scale up**: Add authentication, pagination, categories, etc.

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [SQLite Documentation](https://www.sqlite.org/cli.html)
- [React Hot Toast Docs](https://react-hot-toast.com/)

---

**You're all set! Happy coding! 🚀**
