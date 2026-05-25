# frontend/Dockerfile
# ■■ Stage 1: Build the React app ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
FROM node:20-alpine AS builder
WORKDIR /app
# Install deps first (cache layer)
COPY package*.json .
RUN npm ci --silent
# Copy source and build
COPY . .
# Pass environment variables for the build
ARG REACT_APP_API_URL=http://localhost:8000
ARG REACT_APP_WS_URL=ws://localhost:8000
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_WS_URL=$REACT_APP_WS_URL
RUN npm run build
# ■■ Stage 2: Serve with nginx (tiny ~23MB image) ■■■■■■■■■■■■■■■■■■■■■■
FROM nginx:alpine
# Copy built React app
COPY --from=builder /app/build /usr/share/nginx/html
# Copy nginx config (handles React Router — important!)
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]