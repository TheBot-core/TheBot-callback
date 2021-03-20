FROM debian

RUN apt update
RUN apt install npm nodejs

RUN mkdir code

WORKDIR /code

COPY . .

RUN npm install

ENTRYPOINT [ "npm", "run run" ]