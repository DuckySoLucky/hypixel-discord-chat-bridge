# define base image
FROM node:16.17.0-bullseye-slim

# download dumb-init
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init

# define environment
ENV NODE_ENV production

# set work directory
WORKDIR /usr/src/app

# copy all sources to container
COPY --chown=node:node . /usr/src/app

# install dependencies
RUN npm ci --only=production

# run your app
USER node
CMD [ "dumb-init", "node", "index.js" ]