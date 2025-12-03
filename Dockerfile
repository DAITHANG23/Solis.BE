FROM node:20-alpine

WORKDIR /usr/src/app

RUN apk add --no-cache curl netcat-openbsd

COPY package*.json ./
COPY prisma ./prisma

RUN npm install

RUN npm install -g @nestjs/cli

COPY . .

RUN npx prisma generate


COPY docker-entrypoint.sh /usr/local/bin
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

RUN npm run build

ENTRYPOINT ["docker-entrypoint.sh"]
EXPOSE 9001
EXPOSE 5555

CMD [ "npm", "run", "start:prod" ]