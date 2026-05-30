# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

ARG VITE_BASE_SERVER_URL
ENV VITE_BASE_SERVER_URL=$VITE_BASE_SERVER_URL

# Cài đặt dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Build mã nguồn
COPY . .
RUN npm run build

# Stage 2: Serve với Nginx
FROM nginx:alpine

# Xóa cấu hình mặc định của Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copy dist từ builder sang Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy file cấu hình Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
