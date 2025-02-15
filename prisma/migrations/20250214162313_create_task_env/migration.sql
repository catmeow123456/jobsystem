/*
  Warnings:

  - You are about to drop the column `environment` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "environment";

-- CreateTable
CREATE TABLE "TaskEnv" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "dockerImage" TEXT NOT NULL,
    "fatherId" INTEGER,

    CONSTRAINT "TaskEnv_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TaskEnvTask" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_TaskEnvTask_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "TaskEnv_name_key" ON "TaskEnv"("name");

-- CreateIndex
CREATE INDEX "_TaskEnvTask_B_index" ON "_TaskEnvTask"("B");

-- AddForeignKey
ALTER TABLE "TaskEnv" ADD CONSTRAINT "TaskEnv_fatherId_fkey" FOREIGN KEY ("fatherId") REFERENCES "TaskEnv"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TaskEnvTask" ADD CONSTRAINT "_TaskEnvTask_A_fkey" FOREIGN KEY ("A") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TaskEnvTask" ADD CONSTRAINT "_TaskEnvTask_B_fkey" FOREIGN KEY ("B") REFERENCES "TaskEnv"("id") ON DELETE CASCADE ON UPDATE CASCADE;
