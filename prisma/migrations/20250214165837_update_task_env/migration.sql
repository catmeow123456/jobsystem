-- CreateEnum
CREATE TYPE "TaskEnvStatus" AS ENUM ('active', 'inactive');

-- AlterTable
ALTER TABLE "TaskEnv" ADD COLUMN     "status" "TaskEnvStatus" NOT NULL DEFAULT 'inactive';
