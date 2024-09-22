# Build Stage
FROM node:10.16.0-alpine as as builder
WORKDIR /tmp
COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn run build

# Production Stage
FROM nginx:1.16.1-alpine as production
RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx/nginx.conf /etc/nginx/conf.d/
COPY --from=builder /tmp/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
