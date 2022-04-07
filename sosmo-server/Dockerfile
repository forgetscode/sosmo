FROM node:14

WORKDIR /user/src/app

COPY yarn.lock ./
COPY package.json ./

RUN yarn
RUN yarn build

COPY . .

ENV NODE_ENV production

EXPOSE 8080
CMD ["node", "dist/index.js"]