# We build using Node.js on bullseye, which is what distroless is using.
FROM node:18-bullseye-slim as base

RUN apt-get update && \
    apt-get install -y --no-install-recommends tini && \
    rm -rf /var/lib/apt/lists/* && \
    mkdir /app && \
    chown -R node:node /app

ENV NODE_ENV=production
EXPOSE 3000
USER node
WORKDIR /app


# Download the npm modules we need.
FROM base as modules

COPY --chown=node:node package*.json ./

RUN npm ci --only=production && \
    npm cache clean --force


# Add the source code.
FROM modules as source

COPY --chown=node:node . .


# Build the actual distribution image.
FROM gcr.io/distroless/nodejs:18 as dist

COPY --from=base /usr/bin/tini /usr/bin/tini
COPY --from=source --chown=1000:1000 /app /app

ENV NODE_ENV=production
ENV PATH=/app/node_modules/.bin:$PATH
EXPOSE 3000
USER 1000
VOLUME [ "/app/data", "/app/src/handlers/rpv51" ]
WORKDIR /app

ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["/nodejs/bin/node", "./src/app.js"]
