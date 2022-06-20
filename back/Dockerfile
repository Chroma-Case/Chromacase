FROM node:17
WORKDIR /app
COPY ./package.json ./
RUN npm install
COPY . .
RUN npm run build
CMD npx prisma generate ; npx prisma migrate dev ; npm run start:prod
