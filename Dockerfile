# Build Stage
FROM node:20-alpine
WORKDIR /app
COPY package.json .
RUN yarn install
COPY . .
EXPOSE 3000
ENV REACT_APP_URL_API=http://localhost:8000
ENV DEPLOY=DEV
CMD ["yarn", "run", "dev"]