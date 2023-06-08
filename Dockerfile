FROM node:20-alpine

WORKDIR /diploma-hub

COPY package*.json ./

RUN npm install

COPY . .

COPY ./dist ./dist

CMD ["npm", "run", "start:dev"]