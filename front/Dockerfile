# a Dockerfile to build the expo web app and serve it with nginx
#
# Build the app
FROM node:16-alpine as build
WORKDIR /app
# install expo cli
RUN yarn global add expo-cli@6.0.5
# add sharp-cli (^2.1.0) for faster image processing
RUN yarn global add sharp-cli@^2.1.0

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
ARG API_URL
ENV API_URL=$API_URL
ARG SCORO_URL
ENV SCORO_URL=$SCORO_URL

RUN expo build:web

# Serve the app
FROM nginx:1.21-alpine
COPY --from=build /app/web-build /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template

CMD envsubst '$API_URL $SCOROMETER_URL $NGINX_PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'
