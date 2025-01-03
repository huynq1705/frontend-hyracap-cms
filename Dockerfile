# build stage
FROM node:16.15.1-alpine3.16 as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm i --force --legacy-peer-deps
COPY . .
RUN npm run build:prod

# production stage
FROM nginx:stable-alpine3.17-slim

ARG ARG_BRANCH
ARG ARG_VERSION
ARG ARG_TAG
ARG ARG_ENV
ARG ARG_BUILD_DATE

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/

COPY --from=build-stage /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

ENV APP_BRANCH=${ARG_BRANCH} \
    APP_VERSION=${ARG_VERSION} \
    APP_TAG=${ARG_TAG} \
    APP_ENV=${ARG_ENV} \
    APP_BUILD_DATE=${ARG_BUILD_DATE}

