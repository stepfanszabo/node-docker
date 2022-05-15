# Stage 1
FROM node:15 as build-stage
WORKDIR /
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]