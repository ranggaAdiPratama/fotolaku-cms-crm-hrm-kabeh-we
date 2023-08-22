FROM node:18-alpine
WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install pm2 -g 

COPY . .

EXPOSE 3189

CMD ["pm2-runtime", "/app/index.js"]