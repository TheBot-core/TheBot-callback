FROM debian

RUN apt update
RUN apt install npm nodejs -y

RUN mkdir code

WORKDIR /code

COPY . .

RUN npm install

ENTRYPOINT [ "node", "." ]
