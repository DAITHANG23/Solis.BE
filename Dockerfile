FROM node:20-alpine

WORKDIR /usr/src/app

RUN apk add --no-cache curl netcat-openbsd bash

# copy package files trước để tận dụng layer cache
COPY package*.json ./
RUN npm ci

# copy prisma trước nếu cần
COPY prisma ./prisma
RUN npx prisma generate

# copy toàn bộ source code
COPY . .

# build NestJS
RUN npm run build

# copy entrypoint
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# expose ports
EXPOSE 9001

# start backend thông qua entrypoint
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["node", "dist/main.js"]
