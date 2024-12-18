# Use Node.js as the base image
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci  # Use 'npm ci' for more reliable and faster installs

# Copy the rest of your application code
COPY . .

# Expose the port your app runs on
EXPOSE 5001

# Command to start the app
CMD ["npm", "start"]

RUN npm install dotenv