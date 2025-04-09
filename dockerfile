# Base Image
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# 환경 변수 추가
ARG VITE_BASE_URL
ARG VITE_BACKEND_URL
ENV VITE_BASE_URL=${VITE_BASE_URL}
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}

# Copy package.json and install dependencies
COPY frontend/tsconfig.json ./tsconfig.json
COPY frontend/ .  
COPY frontend/package.json frontend/pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install

# 환경 변수 확인 (디버깅용)
RUN echo "VITE_BASE_URL is set to: $VITE_BASE_URL"
RUN echo "VITE_BACKEND_URL is set to: $VITE_BACKEND_URL"

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