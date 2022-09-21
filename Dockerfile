FROM node:11-alpine

RUN apk --no-cache add \
      bash \
      g++ \
      ca-certificates \
      lz4-dev \
      musl-dev \
      cyrus-sasl-dev \
      openssl-dev \
      make \
      iproute2 \
      iptables \
      python

RUN apk add --no-cache --virtual .build-deps gcc zlib-dev libc-dev bsd-compat-headers py-setuptools bash

RUN mkdir -p /microservice
WORKDIR /microservice

# RUN npm install node-rdkafka
COPY package*.json /microservice
COPY . /microservice
RUN npm install && npm cache clean --force

WORKDIR /microservice

EXPOSE 3010

CMD [ "node", "app.js" ]
