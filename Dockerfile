FROM node:14.15-alpine As development

RUN npm i -g @nestjs/cli rimraf

WORKDIR /usr/src/app

COPY package*.json ./

COPY .npmrc ./

RUN npm install

COPY . .

RUN npm run build

FROM node:14.15-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

COPY .npmrc ./

RUN npm install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist
CMD ["npm", "run", "start:prod"]
