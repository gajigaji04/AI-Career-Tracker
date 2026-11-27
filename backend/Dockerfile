FROM node:20-alpine
WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package*.json ./
COPY src/prisma ./src/prisma
RUN npm ci

COPY . .
RUN npm run build

RUN chown -R node:node /app
USER node

EXPOSE 3000
# exec: sh 를 node 로 교체해서 node 가 PID 1 이 되게 한다.
# 그렇지 않으면 docker stop 의 SIGTERM 이 sh 에서 멈춰 graceful shutdown 이 동작하지 않는다.
CMD ["sh", "-c", "npx prisma migrate deploy --schema=src/prisma/schema.prisma && exec node dist/server.js"]
