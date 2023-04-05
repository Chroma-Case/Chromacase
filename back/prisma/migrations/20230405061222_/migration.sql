/*
  Warnings:

  - The primary key for the `LessonHistory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `SongHistory` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "LessonHistory" DROP CONSTRAINT "LessonHistory_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "LessonHistory_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "SongHistory" DROP CONSTRAINT "SongHistory_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "SongHistory_pkey" PRIMARY KEY ("id");
