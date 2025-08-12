# Use Node.js Alpine for smaller image size
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application code
COPY . .

RUN npm run build

# Expose port
EXPOSE 8080


# Start the application
CMD ["npm", "run", "start"]
