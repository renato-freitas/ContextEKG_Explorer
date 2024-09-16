FROM node:20 as builder
WORKDIR /tmp
COPY . .
RUN yarn install
RUN yarn run build

# CONFIGURANO O NGNIX
# https://www.youtube.com/watch?v=F2au3FXq9Y4
FROM nginx:alpine
COPY --from=builder /tmp/dist /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
