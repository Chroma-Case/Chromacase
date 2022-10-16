-- CreateEnum
CREATE TYPE "DifficultyPoint" AS ENUM ('TwoHands', 'Rhythm', 'NoteCombo', 'Arpeggio', 'Distance', 'LeftHand', 'RightHand', 'LeadHandChange', 'ChordComplexity', 'ChordTiming', 'Length', 'PedalPoint', 'Precision');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Song" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "artistId" INTEGER,
    "albumId" INTEGER,
    "genreId" INTEGER,
    "difficulties" JSONB NOT NULL,

    CONSTRAINT "Song_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Genre" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Artist" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Album" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Album_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requiredLevel" INTEGER NOT NULL,
    "mainSkill" "DifficultyPoint" NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonHistory" (
    "lessonID" INTEGER NOT NULL,
    "userID" INTEGER NOT NULL,

    CONSTRAINT "LessonHistory_pkey" PRIMARY KEY ("lessonID","userID")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Song_name_key" ON "Song"("name");

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonHistory" ADD CONSTRAINT "LessonHistory_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonHistory" ADD CONSTRAINT "LessonHistory_lessonID_fkey" FOREIGN KEY ("lessonID") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
