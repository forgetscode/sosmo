FROM node:14

WORKDIR /user/src/app

COPY yarn.lock ./
COPY package.json ./

RUN yarn

COPY . .
COPY .env.production .env

RUN yarn build

ENV NODE_ENV production

EXPOSE 8080
CMD ["node", "dist/index.js"]
USER node