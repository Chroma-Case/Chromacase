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
CREATE TABLE "Lesson" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requiredLvl" INTEGER NOT NULL,
    "difficulyPoint" "DifficultyPoint" NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
