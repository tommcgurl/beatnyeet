/*
  Warnings:

  - Made the column `platform` on table `Playthrough` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Playthrough" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "gameId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "startDate" DATETIME,
    "completionDate" DATETIME,
    "platform" TEXT NOT NULL,
    "review" TEXT,
    CONSTRAINT "Playthrough_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Playthrough_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Playthrough" ("completionDate", "gameId", "id", "platform", "review", "startDate", "userId") SELECT "completionDate", "gameId", "id", "platform", "review", "startDate", "userId" FROM "Playthrough";
DROP TABLE "Playthrough";
ALTER TABLE "new_Playthrough" RENAME TO "Playthrough";
CREATE UNIQUE INDEX "Playthrough_gameId_userId_platform_key" ON "Playthrough"("gameId", "userId", "platform");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
