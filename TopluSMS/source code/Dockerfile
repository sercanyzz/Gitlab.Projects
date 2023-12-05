#Build Steps
FROM node:alpine3.15 as build-step

RUN mkdir /app
WORKDIR /app

COPY package.json /app
RUN npm install
COPY . /app

RUN npm run build

#Run Steps
FROM nginx:1.23.1-alpine  
COPY --from=build-step /app/build /usr/share/nginx/html
COPY nginx_default.conf /etc/nginx/conf.d/default.conf
RUN chmod -R 770 /var/log /var/run /var/cache/nginx/ /run
RUN chmod -R 777 /usr/share
USER 1001
