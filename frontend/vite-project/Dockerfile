FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy dependencies first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Expose Vite's default dev port
EXPOSE 5173

# Run Vite dev server and bind to all interfaces
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
