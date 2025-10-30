# Vercel Blob Storage Setup Guide

## Issue: Screenshots Not Saving

If you're experiencing issues with screenshots not being saved to your reviews, it's likely because the Vercel Blob storage token is not properly configured.

## Current Status

Your `.env` file currently has a placeholder token:
```env
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
```

This placeholder will cause all file uploads (screenshots and save files) to fail.

## Solution: Set Up Vercel Blob Storage

### Option 1: Use Vercel Blob (Recommended for Production)

1. **Sign up/Login to Vercel**
   - Go to https://vercel.com
   - Create an account or sign in

2. **Create a Blob Storage**
   - Create a new project or select an existing one
   - Go to the "Storage" tab
   - Click "Create Database" → "Blob"
   - Give it a name (e.g., "beat-n-yeat-storage")
   - Click "Create"

3. **Get Your Token**
   - After creating the Blob storage, go to the ".env.local" tab
   - Copy the `BLOB_READ_WRITE_TOKEN` value
   - It should look something like: `vercel_blob_rw_XXXXXXXXXX`

4. **Update Your .env File**
   ```env
   BLOB_READ_WRITE_TOKEN="vercel_blob_rw_XXXXXXXXXX"
   ```

5. **Restart Your Development Server**
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

### Option 2: Local File Storage (Development Only)

If you want to test without Vercel Blob, you can implement local file storage:

1. Create a `public/uploads` directory
2. Modify `/app/api/upload/route.ts` to save files locally
3. Note: This is NOT recommended for production

### Option 3: Alternative Cloud Storage

You can also use other cloud storage providers:
- AWS S3
- Cloudflare R2
- Google Cloud Storage
- Azure Blob Storage

You'll need to modify the upload API route to use the appropriate SDK.

## Verifying the Setup

After configuring the token:

1. **Restart your development server**
2. **Create a new review** at `/reviews/new`
3. **Upload a screenshot** in the Media section
4. **Check for errors** - you should now see clear error messages if something goes wrong
5. **Submit the review** and verify screenshots appear on the review detail page

## Improved Error Handling

The application now provides better feedback when uploads fail:

- ✅ Clear error messages when Vercel Blob is not configured
- ✅ Visual "Uploading..." indicators during file uploads
- ✅ Detailed error messages in the browser console
- ✅ User-friendly error alerts in the form

## Troubleshooting

### "File upload is not configured" Error

This means your `BLOB_READ_WRITE_TOKEN` is either:
- Not set in the `.env` file
- Still set to the placeholder value `"your-vercel-blob-token"`

**Solution:** Follow Option 1 above to get a real token.

### "Upload failed" Error

This could mean:
- Network connectivity issues
- Invalid token
- File size exceeds limits
- Vercel Blob service is down

**Solution:** 
1. Check your internet connection
2. Verify your token is correct
3. Check the browser console for detailed error messages
4. Try uploading a smaller file

### Screenshots Upload But Don't Appear

If the upload succeeds but screenshots don't appear:
1. Check the browser console for errors
2. Verify the review was created successfully
3. Check the database using Prisma Studio: `npm run db:studio`
4. Look at the Screenshot table to see if records were created

## Vercel Blob Pricing

- **Free Tier**: 500 MB storage, 5 GB bandwidth/month
- **Pro**: $0.15/GB storage, $0.10/GB bandwidth
- More details: https://vercel.com/docs/storage/vercel-blob/usage-and-pricing

## Need Help?

- Check the main [SETUP.md](./SETUP.md) for general setup instructions
- Review Vercel Blob documentation: https://vercel.com/docs/storage/vercel-blob
- Check the browser console for detailed error messages
- Open an issue on GitHub if you're still having problems


