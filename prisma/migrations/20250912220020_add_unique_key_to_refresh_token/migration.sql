/*
  Warnings:

  - A unique constraint covering the columns `[refreshToken]` on the table `RefreshToken` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."RefreshToken_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_refreshToken_key" ON "public"."RefreshToken"("refreshToken");
