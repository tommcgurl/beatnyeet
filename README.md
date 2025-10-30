# GameReviews - Game Review Application

A modern web application for reviewing games within your community. Share your gaming experiences, upload screenshots, save files, and discover what others are playing.

## Features

- 🎮 **Game Reviews**: Review games with ratings from 0-10 (including .5 increments)
- 🖼️ **Screenshot Gallery**: Upload and showcase screenshots from your playthrough
- 💾 **Save File Sharing**: Share save files for emulation
- 🎯 **Platform Tracking**: Record which platform you played on
- ⏱️ **Playtime Tracking**: Log start date, finish date, and total playtime
- 🔍 **IGDB Integration**: Search games using Twitch's Internet Gaming Database
- 👥 **User Profiles**: View user profiles with their reviews and statistics
- 🎨 **Modern UI**: Built with Tailwind CSS and shadcn/ui components

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Authentication**: NextAuth.js v5 with email/password
- **Database**: SQLite with Prisma ORM
- **File Storage**: Vercel Blob Storage
- **UI**: Tailwind CSS + shadcn/ui components
- **API Integration**: IGDB (Twitch Gaming Database)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- IGDB API credentials (Twitch Client ID & Secret)
- Vercel Blob Storage token (for file uploads)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd beat-n-yeat-v2
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"
IGDB_CLIENT_ID="your-twitch-client-id"
IGDB_CLIENT_SECRET="your-twitch-client-secret"
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
```

4. Generate a secure NextAuth secret:
```bash
openssl rand -base64 32
```

5. Set up the database:
```bash
npx prisma generate
npx prisma migrate dev
```

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Getting IGDB API Credentials

1. Go to [Twitch Developer Console](https://dev.twitch.tv/console)
2. Register your application
3. Copy your Client ID and Client Secret
4. Add them to your `.env` file

## Getting Vercel Blob Storage Token

1. Create a Vercel account at [vercel.com](https://vercel.com)
2. Create a new project or use an existing one
3. Go to Storage → Blob
4. Create a new Blob store
5. Copy the `BLOB_READ_WRITE_TOKEN` to your `.env` file

## Database Schema

### Models

- **User**: User accounts with authentication
- **Game**: Game information cached from IGDB
- **Review**: User reviews with ratings and content
- **Screenshot**: Screenshots uploaded by users
- **SaveFile**: Save files for emulation

### Relationships

- User → Reviews (one-to-many)
- Game → Reviews (one-to-many)
- Review → Screenshots (one-to-many)
- Review → SaveFile (one-to-one)

## Project Structure

```
/app
  /api
    /auth/[...nextauth]   # NextAuth authentication
    /games                # Game-related endpoints
    /reviews              # Review CRUD operations
    /register             # User registration
    /upload               # File upload to Vercel Blob
  /games/[id]             # Game detail page
  /login                  # Login page
  /profile/[userId]       # User profile page
  /register               # Registration page
  /reviews
    /new                  # Create new review
    /[id]                 # Review detail page
  /page.tsx               # Home page (review feed)
/components
  /ui                     # shadcn/ui components
  /game-search.tsx        # Game search with autocomplete
  /navbar.tsx             # Navigation bar
  /review-card.tsx        # Review card component
  /review-form.tsx        # Review creation form
  /screenshot-gallery.tsx # Screenshot gallery with lightbox
/lib
  /auth.ts                # NextAuth configuration
  /igdb.ts                # IGDB API client
  /prisma.ts              # Prisma client
/prisma
  /schema.prisma          # Database schema
```

## Features in Detail

### Review Creation

1. Search for a game using IGDB integration
2. Select the platform you played on
3. Rate the game from 0-10 (with .5 increments)
4. Write your review
5. Add playtime details (start date, finish date, hours played)
6. Upload screenshots from your playthrough
7. Optionally upload a save file

### Review Feed

- Browse all reviews from the community
- View game cover art, ratings, and screenshots
- Click to see full review details

### User Profiles

- View user statistics (total reviews, average rating, total playtime)
- Browse all reviews by a specific user

### Game Pages

- See all reviews for a specific game
- View aggregate statistics (review count, average rating)
- Browse available platforms

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

Note: For production, consider migrating from SQLite to PostgreSQL for better performance and scalability.

## Development

### Run Database Migrations

```bash
npx prisma migrate dev
```

### Generate Prisma Client

```bash
npx prisma generate
```

### View Database

```bash
npx prisma studio
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues and questions, please open an issue on GitHub.
