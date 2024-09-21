# Stage 1: Build Angular app
FROM node:20-alpine as builder
# Automatically create the directory if it doesn't exist.
WORKDIR /app

COPY ./package.json ./
COPY ./package-lock.json ./
# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .
# Build the Angular app
RUN npm run build

# Stage 2: Serve Angular app using NGINX
FROM nginx:alpine
# Copy built Angular app from Stage 1
COPY --from=builder /app/dist/client/browser /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf