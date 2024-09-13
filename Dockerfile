# Use the Node.js 20 image as the base image
FROM node:20 As Production

# Set the working directory inside the container
WORKDIR /temp/contextekg/frontend

# Copy package.json and package-lock.json
COPY package*.json .

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN yarn run build

# Expose the port the app runs on
EXPOSE 8080

# Command to run the app
CMD ["yarn", "run", "dev"]
