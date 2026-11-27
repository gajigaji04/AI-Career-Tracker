# CareerHub Frontend

React 19 + TypeScript + Vite SPA. 프로젝트 전체 설명은 [루트 README](../README.md) 참고.

## 실행

```bash
npm ci
cp .env.example .env      # VITE_API_URL=http://localhost:3000
npm run dev               # http://localhost:5173
```

백엔드와 로컬 DB 실행 방법은 루트 README "실행 방법" 참고.

## 스크립트

| 명령 | 내용 |
| --- | --- |
| `npm run dev` | Vite 개발 서버 |
| `npm test` | Vitest 1회 실행 (jsdom + Testing Library) |
| `npm run lint` | ESLint |
| `npm run build` | `tsc -b` 타입 체크 + 프로덕션 빌드 |
| `npm run preview` | 빌드 결과 미리보기 |

## 구조

| 디렉토리 | 역할 |
| --- | --- |
| `src/api/` | axios 인스턴스(`withCredentials`, 401 시 토큰 갱신 인터셉터) + 엔드포인트 함수 |
| `src/hooks/` | React Query 훅. 페이지는 API 를 직접 부르지 않고 훅만 사용 |
| `src/pages/` | 라우트 단위 페이지 (`React.lazy` 로 코드 스플리팅) |
| `src/components/` | 공용(`common/`), 레이아웃, 도메인별 Card · Form |
| `src/routes/router.tsx` | `createBrowserRouter`, 로그인 후 화면은 `/app/*` |
| `src/tests/` | 테스트 |

## 규칙

- 스타일은 CSS Modules 만 사용. 768px 이하(모바일 375px)에서 확인
- 폼은 react-hook-form + zod resolver
- 배포 빌드는 `.env.production` 의 `VITE_API_URL=/api` 를 사용하고, Nginx(`nginx.conf`)가 `/api` 를 백엔드로 프록시
- 401 인터셉터는 로그인 전 인증 요청(`/auth/login` 등)에는 토큰 갱신·리다이렉트를 하지 않음 (`shouldSkipRefresh`)
