# Testing Guide

This guide will help you test all features of the GameReviews application.

## Prerequisites

Make sure you've completed the setup in SETUP.md before testing.

## Test Checklist

### 1. Authentication

#### Register a New User
- [ ] Navigate to http://localhost:3000
- [ ] Click "Sign up" in the navigation bar
- [ ] Fill in the registration form with:
  - Name: "Test User"
  - Email: "[email protected]"
  - Password: "password123"
- [ ] Click "Create account"
- [ ] Verify you're redirected to the login page

#### Login
- [ ] Enter your email and password
- [ ] Click "Sign in"
- [ ] Verify you're redirected to the home page
- [ ] Verify your name appears in the navigation bar

#### Logout
- [ ] Click on your avatar in the navigation bar
- [ ] Click "Sign out"
- [ ] Verify you're redirected to the login page

### 2. Game Search (IGDB Integration)

- [ ] Log in to your account
- [ ] Click "New Review" in the navigation
- [ ] In the game search field, type "Zelda"
- [ ] Wait for search results to appear
- [ ] Verify you see game suggestions with cover images
- [ ] Click on a game to select it
- [ ] Verify the game name appears in the search field

**Note**: If game search doesn't work, verify your IGDB credentials in the `.env` file.

### 3. Create a Review

#### Basic Review
- [ ] Select a game from the search
- [ ] Enter platform: "Nintendo Switch"
- [ ] Set rating: 9.5
- [ ] Enter review text: "Amazing game with great gameplay and story!"
- [ ] Click "Create Review"
- [ ] Verify you're redirected to the review detail page
- [ ] Verify all information is displayed correctly

#### Review with Playtime Details
- [ ] Create another review
- [ ] Fill in start date (e.g., 2024-01-01)
- [ ] Fill in finish date (e.g., 2024-01-15)
- [ ] Enter playtime: 45.5 hours
- [ ] Complete and submit the review
- [ ] Verify playtime details appear on the review page

#### Review with Screenshots
- [ ] Create a new review
- [ ] Click "Choose File" under Screenshots
- [ ] Select one or more image files
- [ ] Wait for upload to complete
- [ ] Verify thumbnails appear below the upload button
- [ ] Complete and submit the review
- [ ] Verify screenshots appear in a gallery on the review page
- [ ] Click on a screenshot to open the lightbox
- [ ] Verify you can navigate between screenshots

**Note**: Screenshot uploads require Vercel Blob to be configured.

#### Review with Save File
- [ ] Create a new review
- [ ] Click "Choose File" under Save File
- [ ] Select any file (e.g., a .sav file)
- [ ] Wait for upload to complete
- [ ] Verify the filename appears
- [ ] Complete and submit the review
- [ ] Verify download button appears on the review page
- [ ] Click download and verify the file downloads

**Note**: Save file uploads require Vercel Blob to be configured.

### 4. Review Feed (Home Page)

- [ ] Navigate to http://localhost:3000
- [ ] Verify all reviews are displayed in a grid
- [ ] Verify each review card shows:
  - User avatar and name
  - Game title and cover image
  - Rating (star and number)
  - Platform badge
  - Review excerpt (if available)
  - Screenshot thumbnails (if available)
- [ ] Click on a review card
- [ ] Verify you're taken to the review detail page

### 5. Review Detail Page

- [ ] Navigate to any review
- [ ] Verify all information is displayed:
  - User information
  - Game cover and title
  - Rating
  - Platform
  - Playtime details (if provided)
  - Review text (if provided)
  - Screenshots gallery (if provided)
  - Save file download (if provided)
  - Game description (from IGDB)
- [ ] If screenshots exist, click on one
- [ ] Verify lightbox opens
- [ ] Use arrow buttons to navigate
- [ ] Press X or click outside to close

### 6. User Profile

#### View Your Profile
- [ ] Click on your avatar in the navigation
- [ ] Click "My Profile"
- [ ] Verify you see:
  - Your avatar and name
  - Total number of reviews
  - Average rating
  - Total playtime
  - Grid of all your reviews

#### View Another User's Profile
- [ ] From the home page, click on any review
- [ ] Click on the user's name in the review
- [ ] Verify you're taken to their profile page
- [ ] Verify you see their statistics and reviews

### 7. Game Detail Page

- [ ] From any review, click on the game title
- [ ] Verify you see:
  - Game cover image
  - Game title and description
  - Available platforms
  - Number of reviews
  - Average rating
  - All reviews for that game

### 8. Protected Routes

#### Test Authentication Protection
- [ ] Log out of your account
- [ ] Try to navigate to http://localhost:3000/reviews/new
- [ ] Verify you're redirected to the login page
- [ ] Log back in
- [ ] Verify you can access the new review page

### 9. Responsive Design

- [ ] Open the application on different screen sizes:
  - Desktop (1920x1080)
  - Tablet (768x1024)
  - Mobile (375x667)
- [ ] Verify the layout adapts properly
- [ ] Verify navigation works on mobile
- [ ] Verify forms are usable on mobile

### 10. Edge Cases

#### Empty States
- [ ] Create a new user account
- [ ] Navigate to your profile
- [ ] Verify "No reviews yet" message appears
- [ ] Search for an obscure game that has no reviews
- [ ] Navigate to that game's page
- [ ] Verify "No reviews yet" message appears

#### Invalid Data
- [ ] Try to create a review without selecting a game
- [ ] Verify error message appears
- [ ] Try to create a review without entering a platform
- [ ] Verify error message appears
- [ ] Try to register with an email that already exists
- [ ] Verify error message appears

#### Rating Validation
- [ ] Create a review with rating 0
- [ ] Verify it works
- [ ] Create a review with rating 10
- [ ] Verify it works
- [ ] Create a review with rating 7.5
- [ ] Verify it works

## Database Inspection

Use Prisma Studio to inspect the database:

```bash
npm run db:studio
```

- [ ] Open http://localhost:5555
- [ ] Browse the User table
- [ ] Browse the Review table
- [ ] Browse the Game table
- [ ] Verify all relationships are correct

## Common Issues and Solutions

### IGDB Search Not Working

**Problem**: Game search returns no results or errors

**Solutions**:
1. Check your IGDB credentials in `.env`
2. Verify you have internet connection
3. Check the browser console for errors
4. Verify the IGDB API is not rate-limited

### File Uploads Not Working

**Problem**: Screenshots or save files fail to upload

**Solutions**:
1. Verify `BLOB_READ_WRITE_TOKEN` is set in `.env`
2. Check file size (Vercel Blob has limits)
3. Verify you're logged in
4. Check browser console for errors

### Authentication Issues

**Problem**: Can't log in or session expires immediately

**Solutions**:
1. Verify `NEXTAUTH_SECRET` is set in `.env`
2. Clear browser cookies and try again
3. Check that `NEXTAUTH_URL` matches your development URL
4. Restart the development server

### Database Errors

**Problem**: Prisma errors or "Table not found"

**Solutions**:
1. Run `npm run db:migrate` to ensure database is up to date
2. Delete `dev.db` and run migrations again
3. Run `npm run db:generate` to regenerate Prisma client

## Performance Testing

### Load Testing
- [ ] Create 20+ reviews
- [ ] Navigate to the home page
- [ ] Verify page loads quickly
- [ ] Scroll through reviews
- [ ] Verify smooth scrolling

### Image Loading
- [ ] Create reviews with multiple screenshots
- [ ] Navigate to the review page
- [ ] Verify images load progressively
- [ ] Check that Next.js Image optimization is working

## Accessibility Testing

- [ ] Navigate the site using only keyboard (Tab, Enter, Escape)
- [ ] Verify all interactive elements are accessible
- [ ] Test with a screen reader (if available)
- [ ] Verify form labels are properly associated

## Browser Compatibility

Test in multiple browsers:
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari (if on macOS)
- [ ] Edge

## Reporting Issues

If you find any bugs or issues:

1. Check the browser console for errors
2. Check the terminal/server logs
3. Note the steps to reproduce
4. Create an issue on GitHub with:
   - Description of the issue
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots (if applicable)
   - Browser and OS information

## Next Steps

After testing:

1. Review the code in key files
2. Customize the styling to your preferences
3. Add additional features as needed
4. Deploy to Vercel for production testing
5. Set up a production database (PostgreSQL recommended)

## Production Testing Checklist

Before deploying to production:

- [ ] All environment variables are set in Vercel
- [ ] Database is migrated to PostgreSQL
- [ ] NEXTAUTH_URL is set to production URL
- [ ] File uploads work with production Vercel Blob
- [ ] All features work in production environment
- [ ] SSL/HTTPS is working
- [ ] Performance is acceptable
- [ ] Error handling is in place
- [ ] Logging is configured


