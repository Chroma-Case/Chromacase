-- CreateTable
CREATE TABLE "SongHistory" (
    "songID" INTEGER NOT NULL,
    "userID" INTEGER NOT NULL,

    CONSTRAINT "SongHistory_pkey" PRIMARY KEY ("songID","userID")
);

-- AddForeignKey
ALTER TABLE "SongHistory" ADD CONSTRAINT "SongHistory_songID_fkey" FOREIGN KEY ("songID") REFERENCES "Song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SongHistory" ADD CONSTRAINT "SongHistory_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
