FROM node:20.6-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# Build the TypeScript code into dist/
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]