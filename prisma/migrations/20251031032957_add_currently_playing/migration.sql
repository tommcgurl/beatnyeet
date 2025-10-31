-- DropIndex
DROP INDEX "CurrentlyPlaying_userId_gameId_key";

-- CreateTable
CREATE TABLE "CurrentlyPlayingScreenshot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "currentlyPlayingId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CurrentlyPlayingScreenshot_currentlyPlayingId_fkey" FOREIGN KEY ("currentlyPlayingId") REFERENCES "CurrentlyPlaying" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
