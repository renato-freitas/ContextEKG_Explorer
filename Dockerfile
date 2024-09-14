# Use the Node.js 20 image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /temp/contextekg-frontend

# Copy package.json and package-lock.json
COPY package*.json .

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN yarn run build

RUN npm i -g serve

# Expose the port the app runs on
EXPOSE 3000

# Command to run the app
# CMD ["", "run", "dev", "--", "--host"]
CMD ["serve", "-s", "dist"]
