FROM node:23-alpine as development
WORKDIR /app
COPY package*.json .
RUN npm install

FROM node:23-alpine as builder
WORKDIR /app
COPY --from=development /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:23-alpine as production
WORKDIR /app
COPY package*.json .
RUN npm install --only=production


FROM node:23-alpine as runner
WORKDIR /app
COPY --from=production /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
ENV APIPORT=3000
EXPOSE 3000
CMD ["node", "dist/main.js"]