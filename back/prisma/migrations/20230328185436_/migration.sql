/*
  Warnings:

  - You are about to drop the column `CustomAdds` on the `UserSettings` table. All the data in the column will be lost.
  - You are about to drop the column `Recommendations` on the `UserSettings` table. All the data in the column will be lost.
  - You are about to drop the column `dataCollection` on the `UserSettings` table. All the data in the column will be lost.
  - You are about to drop the column `newsongNotification` on the `UserSettings` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserSettings" DROP CONSTRAINT "UserSettings_userId_fkey";

-- AlterTable
ALTER TABLE "UserSettings" DROP COLUMN "CustomAdds",
DROP COLUMN "Recommendations",
DROP COLUMN "dataCollection",
DROP COLUMN "newsongNotification",
ADD COLUMN     "leaderBoard" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "newSongNotification" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "recommendations" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showActivity" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "weeklyReport" BOOLEAN NOT NULL DEFAULT true;

-- AddForeignKey
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
