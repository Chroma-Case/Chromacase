FROM node:17
WORKDIR /app
COPY ./package.json  ./package-lock.json ./
RUN npm install --frozen-lockfile
COPY . .
RUN npx prisma generate
RUN npm run build
CMD npx prisma migrate dev; npm run start:prod
