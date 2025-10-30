# Setup Guide

This guide will walk you through setting up the GameReviews application from scratch.

## Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages and automatically generate the Prisma client.

## Step 2: Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Or create it manually with the following content:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
IGDB_CLIENT_ID="your-twitch-client-id"
IGDB_CLIENT_SECRET="your-twitch-client-secret"
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
```

### Generate NextAuth Secret

Run this command to generate a secure random secret:

```bash
openssl rand -base64 32
```

Copy the output and paste it as the value for `NEXTAUTH_SECRET` in your `.env` file.

### Get IGDB API Credentials

1. Go to https://dev.twitch.tv/console
2. Log in with your Twitch account (create one if needed)
3. Click "Register Your Application"
4. Fill in the form:
   - Name: GameReviews (or any name)
   - OAuth Redirect URLs: http://localhost:3000
   - Category: Website Integration
5. Click "Create"
6. Copy the **Client ID** and paste it as `IGDB_CLIENT_ID`
7. Click "New Secret" to generate a client secret
8. Copy the **Client Secret** and paste it as `IGDB_CLIENT_SECRET`

### Get Vercel Blob Storage Token

#### Option 1: Using Vercel (Recommended)

1. Go to https://vercel.com and sign up/login
2. Create a new project or select an existing one
3. Go to the "Storage" tab
4. Click "Create Database" → "Blob"
5. Give it a name (e.g., "gamereviews-storage")
6. Click "Create"
7. Go to the ".env.local" tab
8. Copy the `BLOB_READ_WRITE_TOKEN` value

#### Option 2: Local Development Without File Uploads

If you want to test without Vercel Blob initially, you can use a placeholder:

```env
BLOB_READ_WRITE_TOKEN="placeholder-token"
```

Note: File uploads will not work until you set up Vercel Blob properly.

## Step 3: Set Up the Database

Run the database migration to create all tables:

```bash
npm run db:migrate
```

This will:
- Create a SQLite database file (`dev.db`)
- Run all migrations
- Generate the Prisma client

## Step 4: Start the Development Server

```bash
npm run dev
```

The application will be available at http://localhost:3000

## Step 5: Create Your First User

1. Open http://localhost:3000 in your browser
2. Click "Sign up" in the navigation bar
3. Fill in your details:
   - Name (optional)
   - Email
   - Password (minimum 6 characters)
4. Click "Create account"
5. You'll be redirected to the login page
6. Log in with your credentials

## Step 6: Create Your First Review

1. After logging in, click "New Review" in the navigation
2. Search for a game (e.g., "The Legend of Zelda")
3. Select a game from the search results
4. Fill in the review form:
   - Platform (e.g., "Nintendo Switch")
   - Rating (0-10, including .5 increments)
   - Review text (optional)
   - Start/finish dates (optional)
   - Playtime in hours (optional)
   - Screenshots (optional, requires Vercel Blob)
   - Save file (optional, requires Vercel Blob)
5. Click "Create Review"

## Troubleshooting

### Database Issues

If you encounter database errors, try resetting the database:

```bash
rm -f prisma/dev.db
npm run db:migrate
```

### IGDB API Not Working

Make sure:
1. Your Twitch Client ID and Secret are correct
2. You have an active internet connection
3. The IGDB API is not rate-limited (free tier has limits)

### File Upload Not Working

Make sure:
1. You have a valid Vercel Blob token
2. You're logged in when trying to upload
3. The file size is within limits (check Vercel Blob pricing)

### NextAuth Errors

Make sure:
1. `NEXTAUTH_SECRET` is set and is a long random string
2. `NEXTAUTH_URL` matches your development URL (usually http://localhost:3000)

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run db:push` - Push schema changes without migrations

## Database Management

### View Database with Prisma Studio

```bash
npm run db:studio
```

This opens a GUI at http://localhost:5555 where you can:
- View all tables and data
- Edit records
- Delete records
- Run queries

### Create a New Migration

After modifying `prisma/schema.prisma`:

```bash
npm run db:migrate
```

You'll be prompted to name the migration.

## Production Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to https://vercel.com
3. Click "Import Project"
4. Select your GitHub repository
5. Configure environment variables in Vercel:
   - Add all variables from your `.env` file
   - Change `NEXTAUTH_URL` to your production URL
   - Change `DATABASE_URL` to a production database (PostgreSQL recommended)
6. Click "Deploy"

### Migrate from SQLite to PostgreSQL (Production)

For production, it's recommended to use PostgreSQL instead of SQLite:

1. Create a PostgreSQL database (Vercel Postgres, Supabase, etc.)
2. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. Update `DATABASE_URL` in your production environment variables
4. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

## Need Help?

- Check the main README.md for more information
- Open an issue on GitHub
- Review the Next.js documentation: https://nextjs.org/docs
- Review the Prisma documentation: https://www.prisma.io/docs
- Review the NextAuth documentation: https://next-auth.js.org


