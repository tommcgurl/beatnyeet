/*
  Warnings:

  - A unique constraint covering the columns `[gameId,userId,platform]` on the table `Playthrough` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Playthrough_gameId_userId_platform_key" ON "Playthrough"("gameId", "userId", "platform");
