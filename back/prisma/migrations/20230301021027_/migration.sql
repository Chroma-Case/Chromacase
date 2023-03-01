-- DropForeignKey
ALTER TABLE "SongHistory" DROP CONSTRAINT "SongHistory_songID_fkey";

-- AddForeignKey
ALTER TABLE "SongHistory" ADD CONSTRAINT "SongHistory_songID_fkey" FOREIGN KEY ("songID") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;
