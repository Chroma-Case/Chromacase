/*
  Warnings:

  - Added the required column `info` to the `SongHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SongHistory" ADD COLUMN     "info" JSONB NOT NULL;
