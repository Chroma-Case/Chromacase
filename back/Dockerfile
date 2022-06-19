FROM node:17
WORKDIR /app
COPY ./package.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build
CMD ["npm", "run", "start:prod"]