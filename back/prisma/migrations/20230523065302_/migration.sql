-- AlterTable
ALTER TABLE "SearchHistory" ADD COLUMN     "searchDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "SongHistory" ADD COLUMN     "playDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;