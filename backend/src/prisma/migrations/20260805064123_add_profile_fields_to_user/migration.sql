-- CreateEnum
CREATE TYPE "ExperienceLevel" AS ENUM ('STUDENT', 'JOB_SEEKER', 'NEW_DEVELOPER', 'JUNIOR_DEVELOPER', 'EXPERIENCED_DEVELOPER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "experienceLevel" "ExperienceLevel",
ADD COLUMN     "interestedStack" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "jobTitle" TEXT,
ADD COLUMN     "nickname" TEXT NOT NULL DEFAULT '';
