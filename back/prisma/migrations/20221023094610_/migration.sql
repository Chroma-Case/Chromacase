/*
  Warnings:

  - Added the required column `midiPath` to the `Song` table without a default value. This is not possible if the table is not empty.
  - Added the required column `musicXmlPath` to the `Song` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Song" ADD COLUMN     "midiPath" TEXT NOT NULL,
ADD COLUMN     "musicXmlPath" TEXT NOT NULL;
