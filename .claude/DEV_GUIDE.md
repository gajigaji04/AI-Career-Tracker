# CareerHub 개발 가이드

> 이 프로젝트에서 작업할 때(사람이든 Claude든) 따라야 할 규칙과 절차.
> 현재 상태 진단·이슈 목록은 [PROJECT_ANALYSIS.md](./PROJECT_ANALYSIS.md) 참고.

---

## 1. 로컬 실행

```bash
# 최초 1회
cd backend  && npm install      # postinstall 로 prisma generate 자동 실행
cd frontend && npm install

# 실행
cd backend  && npm run dev      # http://localhost:3000  (Swagger: /api-docs)
cd frontend && npm run dev      # http://localhost:5173
```

- `backend/.env` 필수: `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `ALLOWED_ORIGIN`(콤마로 여러 개), `FRONTEND_URL`, `GROQ_API_KEY`, `RESEND_API_KEY`, `AWS_REGION`, `AWS_S3_BUCKET` (전체 목록은 README "환경 변수")
- 프론트는 `VITE_API_URL` 미설정 시 `http://localhost:3000` 사용. 배포 빌드는 `.env.production` 의 `/api`.
- **운영 RDS는 private subnet → 로컬에서 접속 불가.** 로컬 개발은 로컬 Postgres(예: `docker run -p 5432:5432 -e POSTGRES_PASSWORD=... postgres:16`)를 `DATABASE_URL` 로 지정.
- Solapi 키가 없으면 SMS는 로그로만 출력됨 (로컬 테스트용 정상 동작).

## 2. 테스트 / 검증 명령

| 대상 | 명령 | 비고 |
| --- | --- | --- |
| backend 테스트 | `cd backend && npx vitest run` | `npm test` 는 watch 모드 |
| backend 타입체크 | `cd backend && npx tsc --noEmit` | |
| backend 빌드 | `cd backend && npm run build` | |
| frontend 테스트 | `cd frontend && npm test` | `vitest run`, jsdom |
| frontend 린트 | `cd frontend && npm run lint` | |
| frontend 빌드 | `cd frontend && npm run build` | `tsc -b` 포함 |
| 컨테이너 | `docker build -t careerhub-backend ./backend` | Alpine에서 bcrypt 네이티브 빌드 확인용 |

**커밋 전 최소 체크**: backend `vitest run` + `tsc --noEmit`, frontend `test` + `build`.
`app.ts` 나 미들웨어를 건드렸다면 반드시 `app.integration.test.ts` 가 통과하는지 볼 것 (단위 테스트는 `app.ts` 를 로드하지 않음).

---

## 3. 백엔드 기능 추가 패턴

새 리소스 `Foo` 를 추가할 때 순서:

1. **스키마** — `src/prisma/schema.prisma` 에 모델 추가. 반드시 `userId` + `user` relation, 자식 관계가 있으면 `onDelete` 명시.
2. **마이그레이션** — `npx prisma migrate dev --name add_foo` (스키마 경로는 package.json `prisma.schema` 에 설정돼 있음). 생성된 SQL 확인 후 커밋. 운영 반영은 컨테이너 시작 시 `prisma migrate deploy` 가 자동 수행.
3. **validation** — `src/validations/foo.validation.ts`
   - `createFooSchema`, `updateFooSchema = createFooSchema.partial()` 를 **둘 다** 만든다.
   - 클라이언트가 보내면 안 되는 필드(`userId`, `id` 등)가 섞이지 않도록 `.strict()` 권장.
4. **service** — `src/services/foo.service.ts`
   - 모든 쿼리에 `userId` 조건. 단건 조회는 `findFirst({ where: { id, userId } })` → 없으면 `throw new AppError("...", 404)`.
   - update/delete 는 먼저 소유권 조회 함수 호출 후 실행.
   - **`req.body` 를 `prisma.*.update({ data })` 에 그대로 넘기지 말 것.** 허용 필드만 골라서 전달.
5. **controller** — `src/controllers/foo.controller.ts`
   - 로직 없이 service 호출 + 응답만. 응답 형식은 `{ success: true, data }` / 삭제는 `{ success: true, message }`.
   - try/catch 불필요 — Express 5는 async 에러를 errorHandler로 자동 전달.
6. **route** — `src/routes/foo.route.ts`
   - 순서: `authenticate` → (rateLimit) → `validate(schema)` → controller. **POST뿐 아니라 PATCH에도 validate.**
   - `@swagger` JSDoc 주석 작성 (Swagger UI 자동 반영).
7. **app.ts** 에 `app.use("/foos", fooRouter)` 마운트.
8. **테스트** — `src/tests/foo.service.test.ts` (Prisma를 `vi.mock` 으로 목킹, 기존 `study.service.test.ts` 참고). 라우트 체인이 중요하면 `app.integration.test.ts` 에 케이스 추가.

### 에러 처리 규칙

- 예상 가능한 실패는 전부 `AppError(message, status)` 로 던진다. 일반 `Error` 는 500이 된다.
- 계정/번호 존재 여부가 드러나는 응답 금지 (forgot-password, find-email 패턴 유지).
- 로그는 `logger`(pino) 또는 `req.log` 사용. `console.*` 쓰지 않기. 인증번호·토큰·비밀번호는 로그에 남기지 않는다.

### app.ts 미들웨어 순서 (깨지면 안 되는 부분)

```
helmet → cors → cookieParser → express.json → pinoHttp → routers → /api-docs → /health → errorHandler
```

`cookieParser` 나 `express.json` 이 빠지면 인증·검증이 전부 깨진다. 이 파일을 수정하면 diff 전체를 다시 읽어서 의도하지 않은 삭제가 없는지 확인할 것.

---

## 4. 프론트엔드 기능 추가 패턴

1. `src/api/foo.ts` — `api`(axios 인스턴스) 사용, `res.data` 반환. 경로는 `/foos` (prefix `/api` 는 baseURL이 처리).
2. `src/hooks/useFoo.ts` — `useQuery({ queryKey: ["foos"] })`, mutation 성공 시 `invalidateQueries` + `showToast`, 실패 시 `showToast(..., "error")`. 기존 `useStudies.ts` 복사해서 시작.
3. `src/pages/FooPage.tsx` + `FooPage.module.css` — 페이지는 훅만 사용, 로딩/에러는 `PageState` 컴포넌트로.
4. `src/components/foo/` — `FooCard`, `FooForm` (react-hook-form + zod resolver).
5. `src/routes/router.tsx` — `/app` children 에 `lazy` import 로 추가, `Sidebar.tsx` 메뉴 추가.
6. 스타일은 **CSS Modules만** 사용. 768px 이하 모바일 폭(375px)에서 확인.

---

## 5. 브랜치 / 커밋 / 배포

- 브랜치: `feature/*`, `fix/*`, `infra/*` → `main` 으로 PR. **main push = 자동 배포** 이므로 main 직접 push 금지.
- 커밋 메시지: `feat: ...`, `fix: ...` (한국어 본문, 기존 로그와 동일 스타일).
- 배포 파이프라인 (`.github/workflows/deploy.yml`):
  `npm ci` → `npm audit --audit-level=high` → 테스트 → Docker Hub push(`:latest`) → EC2로 compose 파일 scp → `docker compose pull && up -d`
- ⚠️ 현재 EC2 SSH가 개인 IP로 제한돼 있어 마지막 SSH 단계는 실패할 수 있음. 그 경우 본인 IP에서 EC2 접속 후 `cd ~/ai-careerhub && docker compose pull && docker compose up -d --remove-orphans` 수동 실행.
- 운영 헬스체크: `curl https://aicareerhub-site.duckdns.org/api/health` → `{"status":"ok","db":"connected"}`

---

## 6. 주의사항 (과거 사고에서 나온 규칙)

### npm 의존성
- 패키지 추가/업데이트 후 `npm install` 성공만으로 끝내지 말 것. `package-lock.json` 에서 `overrides`(특히 `vite → yaml`) 항목이 조용히 빠지는 일이 반복됐다.
- 검증: `package.json` + `package-lock.json` + `src/prisma` 만 복사한 빈 디렉토리에서 `npm ci` 가 성공하는지 확인.
- `yaml` 을 전역 override 하면 swagger-jsdoc 가 런타임에 깨진다 — override는 `vite` 하위로만.
- Windows에서 만든 lockfile은 Alpine(musl) optional deps가 빠질 수 있음 → Docker 빌드로 확인.

### 설정 파일 (nginx.conf / docker-compose.yml / deploy.yml / app.ts)
- 부분 수정 시 관계없는 줄이 사라지는 사고가 여러 번 있었다. 수정 후 **파일 전체 diff** 확인.
- `nginx.conf` 의 `proxy_pass http://backend:3000/;` 끝 슬래시는 `/api` prefix 제거 역할 — 지우면 모든 API 404.
- `try_files $uri $uri/ /index.html;` 는 SPA 새로고침 404 방지용 — 유지.
- CSP를 바꿀 때는 Swagger UI(`/api-docs`)는 백엔드 helmet 쪽 CSP가 꺼져 있다는 점을 같이 고려.

### DB / 마이그레이션
- 마이그레이션 파일 커밋 ≠ 운영 반영. 운영 반영은 다음 컨테이너 기동 때.
- 기존 컬럼 삭제·타입 변경 같은 파괴적 마이그레이션은 별도 PR로, 데이터 백업 후.

### 외부 서비스
- Resend 무료 플랜은 계정 소유자 이메일로만 발송 가능.
- Groq 키·AWS 키 등 `.env` 는 절대 커밋 금지. EC2 `.pem` 키는 별도 안전한 곳에 백업.

---

## 7. 자주 찾는 파일

| 목적 | 파일 |
| --- | --- |
| 미들웨어 체인 / 라우터 마운트 | `backend/src/app.ts` |
| JWT 발급·검증·무효화 | `backend/src/services/auth.service.ts`, `backend/src/controllers/auth.controller.ts`, `backend/src/middlewares/auth.middleware.ts` |
| AI 프롬프트 | `backend/src/services/ai.service.ts` |
| Rate limit 수치 | `backend/src/middlewares/rateLimit.middleware.ts` |
| DB 스키마 | `backend/src/prisma/schema.prisma` |
| 401 → refresh 처리 | `frontend/src/api/axios.ts` |
| 라우트 정의 | `frontend/src/routes/router.tsx` |
| 리버스 프록시·보안 헤더 | `frontend/nginx.conf` |
| 배포 | `.github/workflows/deploy.yml`, `docker-compose.yml` |
