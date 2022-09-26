-- DropForeignKey
ALTER TABLE "Song" DROP CONSTRAINT "Song_genreId_fkey";

-- AlterTable
ALTER TABLE "Song" ALTER COLUMN "genreId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre"("id") ON DELETE SET NULL ON UPDATE CASCADE;
