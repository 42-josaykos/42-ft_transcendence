FROM node:16-alpine

# WORKDIR /usr/app

WORKDIR /home/node

COPY package*.json ./

RUN apk add curl && npm install

# RUN chown -R node.node /usr/app

RUN chown -R node.node /root

COPY . .
