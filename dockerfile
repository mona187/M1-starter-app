# Stage 1: Build
FROM node:20.6-alpine as builder
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Runtime
FROM node:20.6-alpine
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm install --omit=dev   # install only production deps

EXPOSE 3000
CMD ["npm", "start"]
