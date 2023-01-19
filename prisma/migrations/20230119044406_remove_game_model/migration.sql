/*
  Warnings:

  - You are about to drop the `Game` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `platform` on the `Playthrough` table. All the data in the column will be lost.
  - Added the required column `platformId` to the `Playthrough` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Game_name_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Game";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Playthrough" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "gameId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "startDate" DATETIME,
    "completionDate" DATETIME,
    "platformId" INTEGER NOT NULL,
    "review" TEXT,
    CONSTRAINT "Playthrough_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Playthrough" ("completionDate", "gameId", "id", "review", "startDate", "userId") SELECT "completionDate", "gameId", "id", "review", "startDate", "userId" FROM "Playthrough";
DROP TABLE "Playthrough";
ALTER TABLE "new_Playthrough" RENAME TO "Playthrough";
CREATE UNIQUE INDEX "Playthrough_gameId_userId_platformId_key" ON "Playthrough"("gameId", "userId", "platformId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
