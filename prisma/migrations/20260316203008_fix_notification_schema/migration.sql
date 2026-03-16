/*
  Warnings:

  - You are about to drop the column `profileId` on the `Notification` table. All the data in the column will be lost.
  - Made the column `userId` on table `Notification` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_profileId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- DropIndex
DROP INDEX "Notification_commentId_key";

-- DropIndex
DROP INDEX "Notification_followRequestId_key";

-- DropIndex
DROP INDEX "Notification_likeId_key";

-- DropIndex
DROP INDEX "Notification_postId_key";

-- DropIndex
DROP INDEX "Notification_profileId_key";

-- DropIndex
DROP INDEX "Notification_userId_key";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "profileId",
ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
