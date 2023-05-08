FROM node:lts
ARG NPM_REGISTRY
WORKDIR /usr/src/app
RUN corepack prepare pnpm@8.4.0
RUN corepack enable pnpm
COPY pnpm-lock.yaml ./
RUN pnpm fetch --registry=${NPM_REGISTRY}
COPY . .
RUN pnpm i --offline -r --registry=${NPM_REGISTRY}
RUN pnpm -F @lite-monitor/* build
RUN NODE_ENV=production pnpm -F backend exec webpack
EXPOSE ${APP_PORT}
ENV NODE_ENV=production
CMD ["node", "packages/backend/dist/index.bundle.js"]
