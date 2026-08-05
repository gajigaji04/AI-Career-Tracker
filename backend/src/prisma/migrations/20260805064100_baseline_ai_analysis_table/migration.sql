-- Baseline migration: captures the "AiAnalysis" table/enum that already exists on the
-- production database (added out-of-band, never captured as a migration until now).
-- On production, mark this as already applied instead of running it:
--   npx prisma migrate resolve --applied 20260805064100_baseline_ai_analysis_table

-- CreateEnum
CREATE TYPE "AiAnalysisType" AS ENUM ('COVER_LETTER', 'INTERVIEW_QUESTIONS');

-- CreateTable
CREATE TABLE "AiAnalysis" (
    "id" TEXT NOT NULL,
    "type" "AiAnalysisType" NOT NULL,
    "content" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiAnalysis_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AiAnalysis" ADD CONSTRAINT "AiAnalysis_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiAnalysis" ADD CONSTRAINT "AiAnalysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
