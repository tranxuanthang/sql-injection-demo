# Use the official Node.js 16 image as a parent image
FROM node:16-alpine

# Install build tools to compile native npm modules
RUN apk add --no-cache build-base python3

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app's source code
COPY . .

# Make port 3000 available to the world outside the container
EXPOSE 3000

# Define the command to run your app
CMD [ "node", "index.js" ]
