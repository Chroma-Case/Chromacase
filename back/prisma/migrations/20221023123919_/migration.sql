-- CreateTable
CREATE TABLE "UserSettings" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "pushNotification" BOOLEAN NOT NULL DEFAULT true,
    "emailNotification" BOOLEAN NOT NULL DEFAULT true,
    "trainingNotification" BOOLEAN NOT NULL DEFAULT true,
    "newsongNotification" BOOLEAN NOT NULL DEFAULT true,
    "dataCollection" BOOLEAN NOT NULL DEFAULT true,
    "CustomAdds" BOOLEAN NOT NULL DEFAULT true,
    "Recommendations" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
