## 개요

<!-- 무엇을, 왜 바꿨는지 1~2문장 -->

Closes #

## 변경 사항

-

## 테스트

<!-- 실제로 실행한 것만 체크. 실행하지 않은 항목은 사유를 적는다 -->

- [ ] backend `npx tsc --noEmit` · `npx vitest run`
- [ ] frontend `npm run lint` · `npm test` · `npm run build`
- [ ] 로컬 실행 확인 (확인한 시나리오: )

## 체크리스트

- [ ] base 브랜치가 `dev` 다 (`main` 은 배포용)
- [ ] 비밀 값(`.env`, 키, 토큰)이 포함되지 않았다
- [ ] 설정 파일(`app.ts`, `nginx.conf`, `docker-compose.yml`, workflow) 변경 시 파일 전체 diff 를 확인했다
- [ ] 의존성 변경 시 빈 디렉토리에서 `npm ci` 가 성공했다
- [ ] 스키마 변경 시 마이그레이션을 포함하고 로컬 DB 에 적용해봤다
- [ ] API 변경 시 `authenticate` · `validate` 적용, Swagger 주석 갱신

## 배포 영향

<!-- 환경 변수 추가, 마이그레이션, API 응답 변경, 수동 작업. 없으면 "없음" -->

없음
