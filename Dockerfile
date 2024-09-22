FROM node:20 as builder
WORKDIR /tmp
COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn run build

# CONFIGURANO O NGNIX
# https://www.youtube.com/watch?v=F2au3FXq9Y4
FROM nginx:alpine
RUN rm /etc/nginx/conf.d/default.conf

COPY ./nginx/nginx.conf /etc/nginx/conf.d/

COPY --from=builder /tmp/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
