FROM node:13-alpine AS builder_frontend
WORKDIR /home
COPY ./package.json .
COPY ./webpack.config.js /
RUN mkdir -p ./client
COPY ./assets ./client
COPY ./components ./client
COPY ./helpers ./client
COPY ./locales ./client
COPY ./model ./client
COPY ./pages ./client
COPY ./worker ./client
COPY ./index.js ./client
COPY ./index.html ./client
COPY ./router.js ./client

RUN apk add make git && \
    npm install --silent && \
    NODE_ENV=production npm run build --experimental-modules

EXPOSE 8334