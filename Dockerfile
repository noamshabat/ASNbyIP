FROM node@sha256:fb6cb918cc72869bd625940f42a7d8ae035c4e786d08187b94e8b91c6a534dfd
RUN apk add dumb-init
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN yarn --production=true
USER node
CMD ["dumb-init", "node", "/usr/src/app/dist/index.js"]