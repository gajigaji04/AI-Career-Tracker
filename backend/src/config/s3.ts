import { S3Client } from "@aws-sdk/client-s3";

// credentials 필드를 명시하지 않으면 SDK 기본 자격증명 체인이 적용됨:
// AWS_ACCESS_KEY_ID/SECRET 환경변수가 있으면 그걸 쓰고, 없으면 EC2 인스턴스
// IAM 역할(IMDS)로 자동 대체됨 — 고정 키를 서버에 두지 않아도 되게 하기 위함.
export const s3 = new S3Client({
  region: process.env.AWS_REGION!,
});

export const BUCKET = process.env.AWS_S3_BUCKET!;
