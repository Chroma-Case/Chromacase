FROM node:17
WORKDIR /app
COPY ./package.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npx prisma migrate dev
RUN npm run build
CMD ["npm", "run", "start:prod"]