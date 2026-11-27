## 개요

<!-- 무엇을, 왜 바꿨는지 한두 문장 -->

Closes #

## 변경 유형

- [ ] ✨ 기능 추가
- [ ] 🐛 버그 수정
- [ ] ♻️ 리팩토링
- [ ] 🔒 보안
- [ ] 🏗️ 인프라 / CI·CD
- [ ] 📝 문서

## 변경 사항

-

## 스크린샷 (UI 변경 시)

| Before | After |
| --- | --- |
|  |  |

## 체크리스트

**공통**
- [ ] backend `npx vitest run` / `npx tsc --noEmit` 통과
- [ ] frontend `npm test` / `npm run lint` / `npm run build` 통과
- [ ] `.env`, 키, 토큰 등 비밀 값이 포함되지 않음

**해당 시**
- [ ] `app.ts` · `nginx.conf` · `docker-compose.yml` · `deploy.yml` 수정 → **파일 전체 diff**에서 의도하지 않은 줄 삭제 없음 확인
- [ ] 의존성 변경 → 깨끗한 디렉토리에서 `npm ci` 성공 확인 (lockfile `overrides` 누락 주의)
- [ ] Prisma 스키마 변경 → 마이그레이션 파일 포함, 파괴적 변경 여부 확인
- [ ] 새/수정 API → `authenticate` + `validate`(POST·PATCH 모두) 적용, 서비스에서 `userId` 소유권 확인, Swagger 주석 갱신
- [ ] UI 변경 → 모바일 폭(375px) 확인

## 배포 시 주의사항

<!-- 환경 변수 추가, 마이그레이션, 수동 작업 등. 없으면 "없음" -->

없음
