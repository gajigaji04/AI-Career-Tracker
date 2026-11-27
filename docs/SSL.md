# SSL 인증서 운영 문서

> 작성일: 2026-11-28 · 근거: 저장소 설정 파일(`docker-compose.yml`, `frontend/nginx.conf`, `frontend/Dockerfile`, `.github/workflows/deploy.yml`) 분석
>
> ⚠️ **운영 서버 미검증 문서.** AWS 비용 문제로 EC2 접속을 보류한 상태에서 저장소만 보고 작성했다.
> 실제 인증서 만료일, 크론 존재 여부, 갱신 성공 여부는 **확인되지 않았으며 정상으로 간주하지 않는다.**
> 운영 검증을 재개하면 [5. 운영 검증 체크리스트](#5-운영-검증-체크리스트-미확인)부터 수행한다.

---

## 1. 구조

```
EC2 호스트
 ├─ certbot 실행 방법 · 갱신 크론 ── 저장소에 없음 (서버에만 존재, 미확인)
 └─ docker compose  (~/ai-careerhub)
     └─ frontend  (nginx:alpine)
         ├─ :80   /.well-known/acme-challenge/ → /var/www/certbot   ← volume: certbot-www
         │        그 외 → 301 https
         └─ :443  /etc/letsencrypt/live/aicareerhub-site.duckdns.org/ ← volume: certbot-certs
```

| 항목 | 값 | 출처 |
| --- | --- | --- |
| 도메인 | `aicareerhub-site.duckdns.org` | `nginx.conf` `server_name` |
| 인증서 경로 (컨테이너 내부) | `/etc/letsencrypt/live/<도메인>/fullchain.pem`, `privkey.pem` | `nginx.conf` |
| 인증서 저장소 | Docker named volume `certbot-certs` (실제 이름은 `<compose 프로젝트명>_certbot-certs`, 추정 `ai-careerhub_certbot-certs`) | `docker-compose.yml` |
| ACME 챌린지 webroot | volume `certbot-www` → `/var/www/certbot` | `docker-compose.yml`, `nginx.conf` |
| 발급 방식 | webroot **(추정)** — 80 포트에 챌린지 경로가 열려 있음 | `nginx.conf` |
| certbot 실행 주체 | certbot 컨테이너 **(README 기술, 미확인)**. compose 서비스로 정의돼 있지 않음 | README |

배포(`deploy.yml`)는 `docker compose pull && up -d` 만 수행하며 인증서에는 관여하지 않는다.
`main` 배포 시 frontend 이미지가 바뀌면 컨테이너가 재생성되면서 그 시점의 인증서를 다시 읽는다.

---

## 2. 알려진 문제 (저장소 기준)

| # | 문제 | 위험도 | 대응 |
| --- | --- | --- | --- |
| S1 | 갱신 후 **Nginx reload 단계가 없다.** certbot 이 파일을 갱신해도 Nginx 는 메모리의 옛 인증서를 계속 사용한다. 그동안은 배포 때 컨테이너 재생성으로 가려졌을 수 있으나, 배포가 멈추면 드러난다 | 높음 | `scripts/renew-cert.sh` (갱신 시에만 reload) — 서버 등록은 운영 검증 시 |
| S2 | HSTS `max-age=63072000`(2년). 인증서가 만료되면 브라우저가 우회 버튼 없이 접속을 차단한다 | 높음 | S1 해결 + 외부 모니터링(P0-5). HSTS 값은 유지 |
| S3 | **최초 발급 순서 문제.** Nginx 는 인증서 파일이 없으면 기동 실패 → 80 포트 webroot 를 쓸 수 없음 | 중간 | [4.4 최초 발급 / 복구](#44-최초-발급--볼륨-유실-시-복구) 절차 |
| S4 | `docker compose down -v` 실행 시 인증서 볼륨 삭제 | 중간 | 4.5 백업 절차, 아래 금지 명령 |
| S5 | 로컬·CI 에서 frontend 컨테이너 실행 불가 (인증서 없으면 Nginx 기동 실패) | 중간 | P0-3 에서 로컬 전용 Nginx 설정 추가 예정 |
| S6 | TLS 설정이 기본값 (`ssl_protocols`, `http2`, 세션 캐시 미지정) | 낮음 | 운영 검증 재개 시 `nginx.conf` 보강 (배포 시 즉시 반영되므로 보류) |
| S7 | README 의 "크론으로 자동 갱신 설정" 이 검증된 사실처럼 기술돼 있었음 | 낮음 | README 문구 수정 완료 |
| S8 | `frontend/Dockerfile` 에 `EXPOSE 80` 만 있음 (443 누락, 문서 성격) | 낮음 | 다음 frontend 이미지 변경 때 함께 |

### 금지 명령

```bash
docker compose down -v          # 인증서 볼륨까지 삭제됨
docker volume prune             # 컨테이너가 중지된 상태라면 인증서 볼륨 삭제 가능
```

---

## 3. 갱신 스크립트 — `scripts/renew-cert.sh`

- certbot 컨테이너로 `renew` 실행 → `live/<도메인>/fullchain.pem` 심볼릭 링크 대상이 바뀐 경우에만 `nginx -t` 후 `nginx -s reload`
- `DRY_RUN=1` 이면 staging 서버로 `renew --dry-run` 만 수행 (운영 인증서·Nginx 변경 없음)
- 볼륨 이름이 추정과 다르면 `CERTS_VOLUME`, `WWW_VOLUME` 환경 변수로 지정
- 전제: 서버의 `renewal/<도메인>.conf` 가 `authenticator = webroot`, `webroot_path = /var/www/certbot` 이어야 함 (미확인 — 체크리스트 4번)
- 배포 파이프라인은 `docker-compose.yml` 만 EC2 로 복사하므로 **스크립트는 수동으로 서버에 복사**해야 한다

---

## 4. 절차 (모두 운영 미검증)

`~/ai-careerhub` (EC2) 에서 실행. 볼륨 이름은 `docker volume ls | grep certbot` 으로 먼저 확인.

### 4.1 상태 조회 (읽기 전용)

```bash
# 외부에서 실제로 서비스되는 인증서 (로컬 PC 에서도 가능)
echo | openssl s_client -connect aicareerhub-site.duckdns.org:443 -servername aicareerhub-site.duckdns.org 2>/dev/null \
  | openssl x509 -noout -dates -issuer

# 볼륨에 저장된 인증서
docker run --rm -v ai-careerhub_certbot-certs:/etc/letsencrypt certbot/certbot certificates

# 갱신 설정 (발급 방식 · webroot 경로)
docker run --rm -v ai-careerhub_certbot-certs:/etc/letsencrypt --entrypoint sh certbot/certbot \
  -c "cat /etc/letsencrypt/renewal/*.conf"

# 크론
sudo crontab -l; crontab -l; ls /etc/cron.d/
```

외부 조회 결과와 볼륨 인증서의 만료일이 다르면 S1(reload 누락) 상태다.

### 4.2 갱신 테스트

```bash
DRY_RUN=1 ./renew-cert.sh
```

### 4.3 갱신 + reload

```bash
./renew-cert.sh
```

### 4.4 최초 발급 / 볼륨 유실 시 복구

Nginx 가 인증서 없이 뜨지 못하므로 standalone 으로 먼저 발급한 뒤 webroot 방식으로 전환한다.

```bash
docker compose stop frontend          # 80 포트 비우기 (이 동안 서비스 중단)

docker run --rm -p 80:80 \
  -v ai-careerhub_certbot-certs:/etc/letsencrypt \
  certbot/certbot certonly --standalone \
  -d aicareerhub-site.duckdns.org --email <관리자 이메일> --agree-tos --no-eff-email

docker compose up -d frontend

# 갱신 설정을 webroot 로 전환 (renewal conf 갱신 목적, 1회)
docker run --rm \
  -v ai-careerhub_certbot-certs:/etc/letsencrypt \
  -v ai-careerhub_certbot-www:/var/www/certbot \
  certbot/certbot certonly --webroot -w /var/www/certbot \
  -d aicareerhub-site.duckdns.org --force-renewal

docker compose exec -T frontend nginx -s reload
```

Let's Encrypt 는 동일 도메인 인증서 발급 횟수 제한(주당 5회)이 있으므로 반복 실행 금지. 테스트는 `--dry-run` 또는 `--staging` 으로.

### 4.5 백업

```bash
docker run --rm \
  -v ai-careerhub_certbot-certs:/etc/letsencrypt:ro \
  -v "$HOME":/backup \
  alpine tar czf /backup/letsencrypt-$(date +%F).tgz -C /etc/letsencrypt .
```

백업 파일에는 **개인키가 포함**된다. 저장소에 커밋하지 말고 접근 통제된 곳에 보관.

---

## 5. 운영 검증 체크리스트 (미확인)

운영 검증 재개 시 순서대로 수행하고 결과를 이 표에 기록한다.

| # | 항목 | 명령 | 결과 |
| --- | --- | --- | --- |
| 1 | 외부에서 서비스되는 인증서 만료일 | 4.1 `openssl s_client` | ❓ 미확인 |
| 2 | 실제 볼륨 이름 | `docker volume ls \| grep certbot` | ❓ 미확인 |
| 3 | 볼륨 인증서 만료일 (1번과 일치 여부) | 4.1 `certbot certificates` | ❓ 미확인 |
| 4 | 발급 방식 · webroot 경로 | 4.1 `renewal/*.conf` | ❓ 미확인 |
| 5 | 기존 갱신 크론 존재 여부 · 명령 | 4.1 `crontab -l` | ❓ 미확인 |
| 6 | `renew --dry-run` 성공 | 4.2 | ❓ 미확인 |
| 7 | 필요 시 갱신 + reload 후 1번 재확인 (만료 60일 이상) | 4.3 | ❓ 미확인 |
| 8 | 기존 크론을 `renew-cert.sh` 로 교체 | 3장 크론 예시 | ❓ 미진행 |
| 9 | `/api/health` → `{"status":"ok","db":"connected"}` | `curl` | ❓ 미확인 |
