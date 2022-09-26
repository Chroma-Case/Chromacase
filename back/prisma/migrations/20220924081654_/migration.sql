/*
  Warnings:

  - You are about to drop the column `difficulyPoint` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `requiredLvl` on the `Lesson` table. All the data in the column will be lost.
  - Added the required column `mainSkill` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requiredLevel` to the `Lesson` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "difficulyPoint",
DROP COLUMN "requiredLvl",
ADD COLUMN     "mainSkill" "DifficultyPoint" NOT NULL,
ADD COLUMN     "requiredLevel" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "LessonHistory" (
    "lessonID" INTEGER NOT NULL,
    "userID" INTEGER NOT NULL,

    CONSTRAINT "LessonHistory_pkey" PRIMARY KEY ("lessonID","userID")
);

-- AddForeignKey
ALTER TABLE "LessonHistory" ADD CONSTRAINT "LessonHistory_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonHistory" ADD CONSTRAINT "LessonHistory_lessonID_fkey" FOREIGN KEY ("lessonID") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
