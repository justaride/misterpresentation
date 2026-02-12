FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN NODE_ENV=development npm ci
COPY . .

# Vite env vars are compile-time; pass these as build args in Coolify.
ARG VITE_LIVE_SSE_URL
ARG VITE_LIVE_WS_URL
ARG VITE_SHARE_PASSCODE
ENV VITE_LIVE_SSE_URL=$VITE_LIVE_SSE_URL
ENV VITE_LIVE_WS_URL=$VITE_LIVE_WS_URL
ENV VITE_SHARE_PASSCODE=$VITE_SHARE_PASSCODE

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
