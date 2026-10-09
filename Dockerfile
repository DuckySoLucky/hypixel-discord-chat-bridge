FROM node:22.22.3-alpine3.24

ENV NODE_ENV=production
ENV RUNNING_IN_DOCKER=true

ARG GIT_COMMIT=unknown
ENV GIT_COMMIT=$GIT_COMMIT
ENV GIT_DIRTY=false

ARG NODE_DISABLE_COMPILE_CACHE=1
ARG npm_config_nodedir=/usr/local

WORKDIR /app

RUN apk add --no-cache \
        cairo \
        pango \
        jpeg \
        giflib \
        librsvg \
    && chown node:node /app \
    && npm install -g --cache /tmp/npm-cache pnpm@11.28.3 \
    && rm -rf /tmp/npm-cache

COPY --chown=node:node package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN apk add --no-cache --virtual .build-deps \
        cairo-dev \
        pango-dev \
        jpeg-dev \
        giflib-dev \
        librsvg-dev \
        build-base \
        python3 \
    && pnpm install --frozen-lockfile --store-dir /tmp/pnpm-store --cache-dir /tmp/pnpm-cache \
    && rm -rf /tmp/pnpm-store /tmp/pnpm-cache \
    && find node_modules/.pnpm/minecraft-data@*/node_modules/minecraft-data/minecraft-data/data/bedrock \
        -mindepth 1 -maxdepth 1 ! -name common -exec rm -rf {} + \
    && chown -R node:node node_modules \
    && apk del --no-cache .build-deps

COPY --chown=node:node . .
USER node
RUN pnpm build

ENTRYPOINT ["pnpm", "start"]
