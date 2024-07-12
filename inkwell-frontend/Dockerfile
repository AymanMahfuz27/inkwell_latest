# Use the official Node image
FROM node:18 

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the project files
COPY . .

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Serve the application
CMD ["npx", "serve", "-s", "build"]
