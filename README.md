# CareerHub

개발자 취업 준비 과정을 통합 관리하는 Career Management Platform

🔗 **Live Demo**: https://aicareerhub-site.duckdns.org

## 프로젝트 소개

CareerHub는 취업 준비생이 학습 기록, 프로젝트 경험, 지원 현황을 한 곳에서 관리할 수 있는 웹 서비스입니다.

사용자는 자신의 성장 과정을 데이터로 기록하고, AI 분석을 통해 부족한 역량과 개선 방향을 확인할 수 있습니다.

## 주요 기능

- 회원가입 / 로그인
- 비밀번호 찾기 / 재설정 (이메일 인증)
- 학습 기록 관리
- 프로젝트 관리
- 지원 현황 관리
- 이력서 업로드
- 통계 대시보드
- AI 커리어 분석 (자소서 초안 · 예상 면접 질문 생성)

## 기술 스택

### Frontend

- React
- TypeScript
- React Query
- React Router
- React Hook Form / Zod (폼 검증)
- Recharts (통계 시각화)
- CSS Modules

### Backend

- Node.js
- Express
- TypeScript
- JWT 기반 인증 (Access / Refresh Token)
- Zod (요청 검증)
- Multer / AWS S3 (파일 업로드)
- Resend (이메일 발송)
- Groq (AI 분석)
- Swagger (API 문서)

### Database

- PostgreSQL
- Prisma

### Infra

- AWS EC2
- AWS RDS
- AWS S3
- Nginx (리버스 프록시)
- Let's Encrypt (HTTPS)
- DuckDNS (도메인)

### DevOps

- Docker
- GitHub Actions (CI/CD, 배포 전 백엔드 테스트 게이트)

### Testing

- Vitest (백엔드 유닛 테스트)

## 프로젝트 문서

- [why.md](./why.md) — 이 프로젝트를 만든 이유와 주요 설계 결정
- [docs/ERD.md](./docs/ERD.md)
- [docs/API.md](./docs/API.md)
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
