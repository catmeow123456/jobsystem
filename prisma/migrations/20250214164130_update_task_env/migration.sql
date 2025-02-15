/*
  Warnings:

  - You are about to drop the column `fatherId` on the `TaskEnv` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "TaskEnv" DROP CONSTRAINT "TaskEnv_fatherId_fkey";

-- AlterTable
ALTER TABLE "TaskEnv" DROP COLUMN "fatherId",
ADD COLUMN     "fatherName" TEXT;

-- AddForeignKey
ALTER TABLE "TaskEnv" ADD CONSTRAINT "TaskEnv_fatherName_fkey" FOREIGN KEY ("fatherName") REFERENCES "TaskEnv"("name") ON DELETE SET NULL ON UPDATE CASCADE;
