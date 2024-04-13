FROM node:21-alpine3.18

WORKDIR /app

COPY package*.json .
RUN npm install

COPY . .
RUN npm run build

EXPOSE 5000
ENTRYPOINT ["npm", "run", "serve"]