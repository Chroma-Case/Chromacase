-- CreateTable
CREATE TABLE "LikedSongs" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "songId" INTEGER NOT NULL,
    "addedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LikedSongs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LikedSongs" ADD CONSTRAINT "LikedSongs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikedSongs" ADD CONSTRAINT "LikedSongs_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;
