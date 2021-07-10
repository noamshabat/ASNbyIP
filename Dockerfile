# --------------> The build image
FROM node:latest AS build
WORKDIR /usr/src/app
COPY package*.json /usr/src/app/
RUN yarn --production=true

# --------------> The production image - small image, only dist files and node modules.
FROM node@sha256:fb6cb918cc72869bd625940f42a7d8ae035c4e786d08187b94e8b91c6a534dfd
RUN apk add dumb-init
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY --chown=node:node --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY  --chown=node:node ./dist /usr/src/app
COPY  --chown=node:node .env /usr/src/app/
USER node
CMD ["dumb-init", "node", "/usr/src/app/index.js"]