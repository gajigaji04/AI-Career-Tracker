#!/usr/bin/env bash
# Let's Encrypt 인증서 갱신 → 실제로 갱신됐을 때만 Nginx reload
#
# ⚠️ 운영 미검증 스크립트. 서버 등록 전 docs/SSL.md "운영 검증 체크리스트"를 먼저 수행할 것.
#
# 사용법 (EC2, docker-compose.yml 이 있는 디렉토리 기준):
#   ./renew-cert.sh              # 갱신 시도 (만료 30일 이내일 때만 certbot 이 실제 갱신)
#   DRY_RUN=1 ./renew-cert.sh    # staging 서버로 갱신 테스트만, 운영 인증서·Nginx 변경 없음
#
# 크론 예시 (매일 03:00):
#   0 3 * * * /home/ubuntu/ai-careerhub/renew-cert.sh >> /home/ubuntu/ai-careerhub/renew-cert.log 2>&1

set -euo pipefail

APP_DIR="${APP_DIR:-$HOME/ai-careerhub}"
DOMAIN="${DOMAIN:-aicareerhub-site.duckdns.org}"
PROJECT="${COMPOSE_PROJECT_NAME:-$(basename "$APP_DIR")}"
CERTS_VOLUME="${CERTS_VOLUME:-${PROJECT}_certbot-certs}"
WWW_VOLUME="${WWW_VOLUME:-${PROJECT}_certbot-www}"
CERTBOT_IMAGE="${CERTBOT_IMAGE:-certbot/certbot:latest}"
DRY_RUN="${DRY_RUN:-0}"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }

cd "$APP_DIR"

for volume in "$CERTS_VOLUME" "$WWW_VOLUME"; do
  if ! docker volume inspect "$volume" >/dev/null 2>&1; then
    log "ERROR: Docker volume '$volume' 이 없습니다. 'docker volume ls | grep certbot' 으로 실제 이름 확인 후 CERTS_VOLUME / WWW_VOLUME 지정"
    exit 1
  fi
done

# live/<도메인>/fullchain.pem 은 archive/<도메인>/fullchainN.pem 을 가리키는 심볼릭 링크.
# 갱신되면 N 이 증가하므로 링크 대상이 바뀌었는지로 갱신 여부를 판단한다.
current_cert() {
  docker run --rm \
    -v "$CERTS_VOLUME:/etc/letsencrypt:ro" \
    --entrypoint readlink \
    "$CERTBOT_IMAGE" "/etc/letsencrypt/live/$DOMAIN/fullchain.pem"
}

run_certbot() {
  docker run --rm \
    -v "$CERTS_VOLUME:/etc/letsencrypt" \
    -v "$WWW_VOLUME:/var/www/certbot" \
    "$CERTBOT_IMAGE" "$@"
}

if [ "$DRY_RUN" = "1" ]; then
  log "dry-run 시작 (staging 서버, 운영 인증서 변경 없음)"
  run_certbot renew --dry-run --no-random-sleep-on-renew
  log "dry-run 성공"
  exit 0
fi

before="$(current_cert)"
log "갱신 시도 (현재: $before)"
run_certbot renew --quiet --no-random-sleep-on-renew
after="$(current_cert)"

if [ "$before" = "$after" ]; then
  log "갱신 대상 아님 (만료 30일 이상 남음) — Nginx reload 생략"
  exit 0
fi

log "인증서 갱신됨 ($before → $after) — Nginx 설정 검사 후 reload"
docker compose exec -T frontend nginx -t
docker compose exec -T frontend nginx -s reload
log "Nginx reload 완료"
