# CareerHub 프로젝트 분석

> 작성일: 2026-11-27 · 기준 브랜치: `feature/frontend-ui` (`e5855da`) + 커밋 안 된 변경 2개 파일
> 범위: backend / frontend / infra(Docker·Nginx·GitHub Actions) 전체 코드 정독 기반

---

## 1. 한 줄 요약

학습 기록·프로젝트·지원 현황·이력서를 모아두고, 그 데이터로 **Groq(Llama 3.3 70B)** 가 자기소개서 초안 / 예상 면접 질문을 만들어주는 개인 커리어 관리 서비스.
Express 5 + Prisma(PostgreSQL/RDS) 백엔드, React 19 + React Query SPA 프론트엔드, EC2 위 Docker Compose + Nginx(HTTPS) 배포.

---

## 2. 구조 한눈에 보기

```
AI_careerHub/
├── backend/                 Express 5 + TypeScript (CommonJS, tsc 빌드)
│   └── src/
│       ├── server.ts        포트 3000 고정 listen
│       ├── app.ts           미들웨어 · 라우터 마운트 · /health · Swagger
│       ├── routes/          라우터 + @swagger JSDoc 주석
│       ├── controllers/     req → service 호출 → { success, data } 응답
│       ├── services/        비즈니스 로직 + Prisma 쿼리 (테스트 대상)
│       ├── validations/     Zod 스키마 (body만 검증)
│       ├── middlewares/     authenticate / validate / rateLimit / errorHandler
│       ├── errors/AppError  statusCode 를 가진 도메인 에러
│       ├── config/          logger(pino) · s3 · swagger
│       ├── prisma/          schema.prisma · migrations/ · 싱글턴 client
│       └── tests/           서비스 단위 테스트 6개 + supertest 통합 테스트 1개
├── frontend/                React 19 + Vite 8 + TypeScript
│   └── src/
│       ├── api/             axios 인스턴스(withCredentials + 401 refresh 인터셉터) + 엔드포인트 함수
│       ├── hooks/           React Query 훅 (useStudies, useApplication …) — 페이지는 훅만 사용
│       ├── pages/           라우트 단위 페이지 (lazy import)
│       ├── components/      common / layouts / landing / 도메인별 Card·Form
│       ├── routes/router.tsx createBrowserRouter, /app/* 는 RootLayout 하위
│       └── tests/           RegisterPage, useMe, useStudies
├── frontend/nginx.conf      80→443 리다이렉트, SSL 종료, /api/ → backend:3000 프록시, SPA fallback
├── docker-compose.yml       backend + frontend 2개 서비스 (DB는 외부 RDS)
├── .github/workflows/deploy.yml  main push → test/audit → Docker Hub push → EC2 SSH 배포
└── docs/                    API.md · ARCHITECTURE.md · ERD.md · 스크린샷
```

### 요청 흐름

```
Browser ──HTTPS──▶ Nginx(443) ──┬─ 정적 파일 (React dist)
                                └─ /api/*  ──▶ backend:3000  (prefix /api 제거됨)
                                                 │
                     route → authenticate → validate(Zod) → controller → service → Prisma → RDS
                                                                              ├→ S3 (이력서)
                                                                              ├→ Groq (AI)
                                                                              ├→ Resend (메일)
                                                                              └→ Solapi (SMS, 미설정 시 로그)
```

- 프론트는 배포 시 `VITE_API_URL=/api`, 로컬은 `http://localhost:3000` 직접 호출.
- 백엔드 라우트에는 `/api` prefix가 **없다**. Nginx `proxy_pass http://backend:3000/;` 의 trailing slash가 prefix를 벗겨낸다.

---

## 3. 도메인 모델 (Prisma)

| 모델 | 핵심 필드 | 비고 |
| --- | --- | --- |
| `User` | email(unique), password(bcrypt), name, nickname, phone(unique), `tokenVersion` | 비밀번호 재설정 토큰, 휴대폰 인증코드를 User 컬럼에 직접 저장 |
| `Study` | title, content, category, studyTime(분), studyDate | |
| `Project` | title, description, githubUrl?, deployUrl?, `techStack String[]` | 입력은 콤마 문자열 → 서버에서 split |
| `Application` | companyName, position, `status`(5단계 enum), appliedAt, memo? | |
| `AiAnalysis` | type(COVER_LETTER / INTERVIEW_QUESTIONS), content, applicationId | **항상 create** (덮어쓰지 않고 누적) |
| `Resume` | fileName, fileUrl(S3 정적 URL), version | 조회 시 5분짜리 presigned URL로 치환 |

- 모든 리소스는 `userId` 로 소유자 제한. 서비스 계층에서 `findFirst({ id, userId })` 로 소유권 확인 후 `update/delete({ id })` 하는 패턴.
- FK에 `onDelete` 지정이 없음 → Application 삭제 시 연결된 `AiAnalysis` 가 있으면 FK 위반으로 삭제 실패 (아래 4.2 참고).

---

## 4. 발견 사항

심각도: 🔴 즉시 수정 / 🟠 버그·보안 / 🟡 개선 권장

### 4.1 🔴 커밋 안 된 변경이 백엔드를 깨뜨림 (`app.ts`, `error.middleware.ts`)

현재 working tree의 `backend/src/app.ts` diff를 보면 CORS를 다중 Origin 지원으로 바꾸는 과정에서 **아래 미들웨어 4개가 통째로 삭제**됐다.

| 삭제된 줄 | 영향 |
| --- | --- |
| `app.use(cookieParser())` | `req.cookies` 가 `undefined` → `authenticate` 에서 TypeError → **모든 인증 API 실패**, `/auth/refresh`·`/auth/logout` 도 동일 |
| `app.use(express.json())` | `req.body` 가 `undefined` → `validate` 가 전부 400, 로그인/회원가입 불가 |
| `app.use(helmet(...))` | 백엔드 보안 헤더 사라짐 (`/api-docs` 등 Nginx 외 경로) |
| `app.use(pinoHttp(...))` | 요청 로그·request id 사라짐 |

`error.middleware.ts` 도 `AppError` 분기가 제거돼서 **404/401/400 도메인 에러가 전부 500으로** 내려가고, `console.error` 로 바뀌어 pino 로그 체계에서 빠졌다. 이전 코드는 주석으로 남아 있음.

메모리에 기록된 "설정 파일 부분 수정 시 무관한 줄이 조용히 사라지는" 패턴과 같은 유형으로 보인다.
**조치**: 다중 Origin CORS 부분만 살리고 나머지 4줄과 기존 errorHandler를 복구할 것. 통합 테스트(`app.integration.test.ts`)를 돌리면 바로 잡힌다.

권장 형태:

```ts
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: (origin, cb) => { /* allowedOrigins 체크 */ }, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(pinoHttp({ logger, autoLogging: { ignore: (req) => req.url === "/health" } }));
```

### 4.2 🟠 백엔드 버그 / 보안

| # | 위치 | 문제 | 제안 |
| --- | --- | --- | --- |
| B1 | `routes/study.route.ts:139`, `routes/project.route.ts:137` | PATCH에 `validate` 없음. 특히 `study.service.updateStudy` 는 `req.body` 를 그대로 `prisma.study.update({ data })` 에 넘김 → body에 `userId` 를 넣으면 **다른 유저에게 레코드 소유권 이전 가능(mass assignment)**, 알 수 없는 필드는 Prisma 에러 → 500 | `updateStudySchema = createStudySchema.partial().strict()` 추가하고 서비스에서 필드 화이트리스트 |
| B2 | `services/auth.service.ts:40` | 중복 이메일 시 `throw new Error(...)` → 500 | `AppError(..., 409)` |
| B3 | `routes/auth.route.ts:81` | `/auth/login` 에 `validate` 없음 | `loginSchema` 추가 |
| B4 | `services/auth.service.ts` login | 없는 계정 404 / 비번 틀림 401 로 응답이 갈림 → 계정 존재 여부 노출. forgot-password·find-email 은 열거 방지를 해두고 로그인만 예외 | 둘 다 401 + 동일 메시지 |
| B5 | `verifyFindEmail` | 6자리 코드에 시도 횟수 제한이 IP 기준 rate limit(15분/10회)뿐 → IP 분산 시 브루트포스 여지 | 유저별 실패 카운터, N회 실패 시 코드 폐기 |
| B6 | `sms.service.ts` | Solapi 미설정이면 **인증번호를 info 로그에 평문 기록**. 프로덕션도 미설정 상태라면 로그 접근자가 타인 계정 이메일 조회 가능 | `NODE_ENV==="production"` 이면 로그 대신 에러 throw 또는 코드 마스킹 |
| B7 | `prisma/schema.prisma` AiAnalysis | `onDelete` 미지정 → AI 분석이 있는 지원 내역 삭제 시 FK 위반 → 500 | `onDelete: Cascade` 마이그레이션 또는 서비스에서 트랜잭션으로 선삭제 |
| B8 | `ai.service.ts` | `application.companyName/position`, 프로젝트 설명 등 유저 입력이 프롬프트에 그대로 들어감 (자기 데이터라 피해 범위는 본인 한정) / Groq 호출 타임아웃·에러 매핑 없음 | 타임아웃 설정, Groq 에러 → `AppError(502)` |
| B9 | `resume.service.ts` | 버전 계산이 `findMany` 후 max+1 → 동시 업로드 시 중복 버전. S3 업로드 성공 후 DB 실패하면 고아 객체. fileFilter는 클라이언트가 준 mimetype만 신뢰 | `aggregate _max` + unique(userId, version), 실패 시 S3 삭제 |
| B10 | `validate.middleware.ts` | `safeParse` 결과(`result.data`)를 `req.body` 에 다시 넣지 않음 → Zod가 걸러낸 값이 아니라 원본 body가 서비스로 감 | `req.body = result.data` |
| B11 | `dashboard.service.ts` | count 3개를 순차 await | `Promise.all` 또는 `$transaction` |
| B12 | `app.ts` `GET /` | `localhost:5173` 하드코딩된 HTML | 제거하거나 개발 환경에서만 |
| B13 | `server.ts` | 포트 3000 하드코딩, graceful shutdown(`prisma.$disconnect`) 없음 | `process.env.PORT ?? 3000`, SIGTERM 처리 |

### 4.3 🟠 프론트엔드

| # | 위치 | 문제 | 제안 |
| --- | --- | --- | --- |
| F1 | `api/axios.ts` 인터셉터 | **로그인 실패(401)도 refresh 시도 → 실패 → `/login` 강제 이동**. 로그인 페이지에서 에러 토스트 대신 새로고침처럼 보일 수 있음. `/auth/refresh`, `/auth/login` 은 인터셉터 대상에서 제외해야 함 | `if (originalRequest.url?.includes("/auth/"))` 예외 처리 |
| F2 | 같은 곳 | 동시에 여러 요청이 401 → refresh 요청이 N번 발생 | 진행 중인 refresh Promise를 공유하는 큐 패턴 |
| F3 | `routes/router.tsx` | `/app/*` 에 라우트 가드 없음. 비로그인 사용자는 각 페이지 쿼리가 401 → 인터셉터 리다이렉트에 의존 (화면이 잠깐 깜빡임) | `RootLayout` 에서 `useMe()` 로 가드 + `<Navigate to="/login" />` |
| F4 | `main.tsx` | `new QueryClient()` 기본값 → 401도 3회 retry | `retry: (count, err) => err.response?.status !== 401 && count < 2` |
| F5 | `api/*.ts` | 응답 타입이 대부분 `any` (`res.data` 그대로) | `ApiResponse<T>` 제네릭 도입 |

### 4.4 🟡 인프라 / CI

| # | 항목 | 상태 |
| --- | --- | --- |
| I1 | **SSL 인증서 만료** | 메모리 기록상 만료일 2026-11-02, `certbot renew --dry-run` 검증 미완료. 오늘(11-27) 기준 이미 지났으므로 **갱신됐는지 즉시 확인 필요**. 이 환경에서 443 접속 확인은 실패함 (사이트 다운 or 네트워크 차단, 원인 미확인) |
| I2 | CI 배포 단계 | EC2 보안그룹 22번 포트를 본인 IP로 제한한 뒤 GitHub Actions SSH 배포가 막힌 상태 (메모리 기록). main push 시 마지막 2 step 실패 예상 |
| I3 | `deploy.yml` | 테스트가 이미 게이트로 들어가 있음 → `why.md` "CI가 테스트를 게이트로 쓰지 않는다", "프론트 테스트 없음" 문구는 **outdated** |
| I4 | Docker 태그 | `:latest` 만 사용 → 롤백 불가. `${{ github.sha }}` 태그 병행 권장 |
| I5 | `deploy.yml` | backend `npm test` = `vitest` (watch 모드). CI 환경변수 덕에 1회 실행되지만 `vitest run` 으로 명시하는 게 안전 |
| I6 | `tsc --noEmit` / `eslint` | CI에서 타입체크·린트 단계 없음 (frontend `build` 는 Docker 안에서 `tsc -b` 수행하므로 간접 체크됨) |
| I7 | Docker 컨테이너 시작 시 `prisma migrate deploy` | 동작은 하나, 마이그레이션 실패 시 컨테이너가 재시작 루프. 장기적으로는 배포 step에서 분리 권장 |

---

## 5. 잘 되어 있는 점 (포트폴리오 어필 포인트)

- **httpOnly 쿠키 + refresh token `tokenVersion` 무효화**: 로그아웃·비밀번호 재설정 시 기존 refresh 토큰 전부 폐기. 테스트까지 있음.
- **계정 열거 방지**: 비밀번호 찾기·아이디 찾기는 존재 여부와 무관하게 동일 응답.
- **S3 퍼블릭 차단 + presigned URL**, EC2 IAM Role 대응(SDK 기본 자격증명 체인).
- **계층 분리**가 일관됨 (route → controller → service), 서비스 단에서 항상 `userId` 로 소유권 체크.
- **Rate limit**: auth 15분/10회, AI 1시간/20회.
- Nginx 보안 헤더(HSTS, CSP, X-Frame-Options 등), 백엔드 컨테이너 non-root 실행.
- 통합 테스트가 실제 미들웨어 체인을 검증 → 과거 lockfile/yaml override 사고를 실제로 잡아낸 이력.
- 트러블슈팅·설계 이유가 README / why.md 에 문서화.

---

## 6. 우선순위 제안

1. **4.1 복구** (app.ts / error.middleware.ts) → 통합 테스트 통과 확인 후 커밋
2. **I1 인증서 상태 확인** (EC2에서 `sudo certbot certificates`)
3. B1 PATCH 검증 + mass assignment 차단, B10 `req.body = result.data`
4. F1 axios 인터셉터 auth 경로 예외
5. B2·B3·B4 auth 응답 정리, B7 AiAnalysis cascade
6. I2 CI 배포 경로 복구 (OIDC + SG 임시 오픈 or SSM Run Command)
7. why.md / README 의 outdated 문구 정리 (I3)

---

## 7. 검증 메모

- 정적 분석만 수행. `backend/node_modules`, `frontend/node_modules` 가 설치돼 있지 않아 **테스트는 실행하지 못함**.
- 4.1의 영향은 코드상 확실하지만(cookie-parser 없이 `req.cookies.accessToken` 접근 → TypeError), 실제 실행으로 재현하지는 않았음.
