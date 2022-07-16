FROM node:14-alpine

RUN apk add --no-cache libc6-compat

WORKDIR /src

COPY package.json ./

RUN npm install --frozen-lockfile

COPY . .

EXPOSE 3000
