FROM node:20.17-alpine


RUN addgroup appgroup && adduser -S -G appgroup appuser


WORKDIR /app

COPY package*.json ./

RUN npm install --force

COPY . .

RUN npm run build

USER appuser


EXPOSE 3000


CMD ["npm", "start"]
