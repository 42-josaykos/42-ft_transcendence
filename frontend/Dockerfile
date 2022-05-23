FROM node:16-alpine

WORKDIR /home/node

COPY package*.json ./

RUN apk add curl && npm install

RUN chown -R node.node /root

COPY . .
