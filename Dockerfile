FROM node:lts-alpine

RUN mkdir code

WORKDIR /code

COPY . .

RUN npm install

ENTRYPOINT [ "node", "." ]
