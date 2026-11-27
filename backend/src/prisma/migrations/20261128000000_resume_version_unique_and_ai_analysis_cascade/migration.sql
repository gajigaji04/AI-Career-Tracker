-- 1) AiAnalysis → Application FK: 지원 내역 삭제 시 AI 분석도 함께 삭제
-- DropForeignKey
ALTER TABLE "AiAnalysis" DROP CONSTRAINT "AiAnalysis_applicationId_fkey";

-- AddForeignKey
ALTER TABLE "AiAnalysis" ADD CONSTRAINT "AiAnalysis_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 2) Resume (userId, version) unique
-- 기존 업로드 로직(조회 후 max+1)은 동시 업로드 시 같은 버전을 만들 수 있었다.
-- 운영 DB에 중복이 있으면 unique 인덱스 생성이 실패하므로 먼저 정리한다.
-- 행은 삭제하지 않고, 중복 그룹에서 가장 먼저 만든 행은 그대로 두고
-- 나머지 행에만 해당 사용자의 최대 버전 다음 번호를 생성 순서대로 부여한다.
WITH ranked AS (
  SELECT
    id,
    "userId",
    "createdAt",
    ROW_NUMBER() OVER (PARTITION BY "userId", version ORDER BY "createdAt", id) AS dup_rank
  FROM "Resume"
),
to_fix AS (
  SELECT
    id,
    "userId",
    ROW_NUMBER() OVER (PARTITION BY "userId" ORDER BY "createdAt", id) AS seq
  FROM ranked
  WHERE dup_rank > 1
),
max_version AS (
  SELECT "userId", MAX(version) AS max_v
  FROM "Resume"
  GROUP BY "userId"
)
UPDATE "Resume" r
SET version = m.max_v + t.seq
FROM to_fix t
JOIN max_version m ON m."userId" = t."userId"
WHERE r.id = t.id;

-- CreateIndex
CREATE UNIQUE INDEX "Resume_userId_version_key" ON "Resume"("userId", "version");
