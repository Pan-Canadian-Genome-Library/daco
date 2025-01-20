# Global variables
ARG COMMIT=""
ARG APP_USER=pcgldaco
ARG WORKDIR=/app

#######################################################
# Configure Base Image
#######################################################
FROM node:22-alpine AS base

ARG APP_USER
ARG WORKDIR

RUN apk update
RUN apk add --no-cache libc6-compat

# # Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.

# RUN apk add --no-cache libc6-compat

# # install pnpm as root user, before updating node ownership
# RUN npm i -g pnpm

# Create non-root user
ENV APP_UID=9999
ENV APP_GID=9999
RUN addgroup -S -g $APP_GID ${APP_USER} \
	&& adduser -S -u $APP_UID -g $APP_GID ${APP_USER}

RUN mkdir -p ${WORKDIR} \
	&& chown -R ${APP_USER}:${APP_USER} ${WORKDIR}

# Enables pnpm
RUN corepack enable

WORKDIR ${WORKDIR}

USER ${APP_USER}:${APP_USER}

COPY --chown=${APP_USER}:${APP_USER} . ./

RUN pnpm install --ignore-scripts --frozen-lockfile
RUN pnpm build:all

#######################################################
# UI Server
#######################################################

FROM nginx:1.27-alpine-slim as daco-ui

ARG APP_USER
ARG WORKDIR
ARG DACO_UI_DIR=${WORKDIR}/apps/ui

# Create non-root user
ENV APP_UID=9999
ENV APP_GID=9999
RUN addgroup -S -g $APP_GID ${APP_USER} \
	&& adduser -S -u $APP_UID -g $APP_GID ${APP_USER}

# Modify permissions on nginx for our new user
RUN	chown -R ${APP_USER}:${APP_USER} /var/cache/nginx && \
	chown -R ${APP_USER}:${APP_USER} /etc/nginx/ && \
	chmod -R 755 /etc/nginx/ && \
	chown -R ${APP_USER}:${APP_USER} /var/log/nginx

RUN mkdir -p /etc/nginx/ssl/ && \
	chown -R ${APP_USER}:${APP_USER} /etc/nginx/ssl/ && \
	chmod -R 755 /etc/nginx/ssl/

RUN touch /var/run/nginx.pid && \
	chown -R ${APP_USER}:${APP_USER} /var/run/nginx.pid /run/nginx.pid

# Switch to new user
USER ${APP_USER}

# Copy site and nginx config
COPY --from=base ${DACO_UI_DIR}/dist /usr/share/nginx/html
COPY --from=base ${DACO_UI_DIR}/docker/nginx.conf.template /etc/nginx/templates/nginx.conf.template
RUN rm -f /etc/nginx/conf.d/default.conf

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]

#######################################################
# DACO API
#######################################################

FROM base as daco-api

ARG APP_USER
ARG WORKDIR
ARG BUILDER_APP_DIR=${WORKDIR}/apps/api

USER ${APP_USER}

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

WORKDIR ${BUILDER_APP_DIR}

CMD ["pnpm", "start:prod"]
