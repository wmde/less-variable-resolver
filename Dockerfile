FROM node:12.2

ARG UID=1000
ARG GID=1000

RUN usermod -u $UID node
RUN groupmod -g $GID node

USER node
