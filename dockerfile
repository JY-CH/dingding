# Base Image
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
# Copy project files

COPY frontend/tsconfig.json ./tsconfig.json
COPY frontend/ .  
COPY frontend/package.json frontend/pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install



# Build the project
RUN pnpm run build

# Use nginx to serve the build files
FROM nginx:latest

# Set working directory
WORKDIR /usr/share/nginx/html

# Remove default nginx content
RUN rm -rf ./*

# Copy build files from previous stage
COPY --from=build /app/dist ./

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
