FROM node:8.1.2

ENV NODE_ENV production
ENV WRI_API_URL https://api.resourcewatch.org/v1
ENV BASEMAP_TILE_URL https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png
ENV API_URL https://beta.prepdata.org/api
ENV CONTROL_TOWER_URL https://production-api.globalforestwatch.org
ENV CALLBACK_URL https://beta.prepdata.org/auth
ENV STATIC_SERVER_URL=
ENV APPLICATIONS prep
ENV OPBEAT_ORG_ID 17ab8eb501d2418a81f3167c10407e90
ENV OPBEAT_APP_ID 7170680c2a
ENV ADD_SEARCH_KEY cb7e797b8a3c0d09c323955f0c4f957a
ENV TRANSIFEX_LIVE_API fca0343bce994bf8ba3dcdeaab389136

RUN apt-get update && \
    apt-get install -y bash git build-essential \
    automake autoconf make g++ libtool libcairo2-dev \
    && npm install -g node-gyp --loglevel warn \
    && mkdir -p /usr/src/app && mkdir -p /usr/src/app

# Add app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
COPY yarn.lock /usr/src/app/
RUN yarn install

# Bundle app source
COPY . /usr/src/app
RUN yarn run build

EXPOSE 3000

CMD ["yarn", "start"]
