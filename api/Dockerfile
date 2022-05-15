FROM node:15
WORKDIR /api
COPY package.json .
RUN npm install
COPY . .
CMD npm start
# COPY package.json .

# ARG NODE_ENV
# RUN if [ "$NODE_ENV" = "development" ]; \
#         then npm install; \
#         else npm install --only=production; \
#         fi

# COPY . ./
# ENV PORT 5000
# EXPOSE $PORT
# CMD ["npm", "index.js"]