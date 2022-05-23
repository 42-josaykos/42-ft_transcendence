FROM node:16-alpine

WORKDIR /node/home

COPY package*.json ./

RUN apk add curl && npm install

COPY . .
