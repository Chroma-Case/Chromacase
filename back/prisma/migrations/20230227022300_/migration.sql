/*
  Warnings:

  - Added the required column `difficulties` to the `SongHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SongHistory" DROP CONSTRAINT "SongHistory_userID_fkey";

-- AlterTable
ALTER TABLE "SongHistory" ADD COLUMN     "difficulties" JSONB NOT NULL;

-- AddForeignKey
ALTER TABLE "SongHistory" ADD CONSTRAINT "SongHistory_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
