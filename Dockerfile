FROM --platform=$BUILDPLATFORM node:18.9-alpine3.15 AS client-builder
WORKDIR /ui
# cache packages in layer
COPY ui/package.json /ui/package.json
COPY ui/package-lock.json /ui/package-lock.json
RUN --mount=type=cache,target=/usr/src/app/.npm \
    npm set cache /usr/src/app/.npm && \
    npm ci
# install
COPY ui /ui
RUN npm run build

FROM alpine
ARG TARGETARCH
LABEL org.opencontainers.image.title="debug-ctr" \
    org.opencontainers.image.description="My awesome Docker extension" \
    org.opencontainers.image.vendor="Felipe" \
    com.docker.desktop.extension.api.version="0.3.0" \
    com.docker.extension.screenshots="" \
    com.docker.extension.detailed-description="" \
    com.docker.extension.publisher-url="" \
    com.docker.extension.additional-urls="" \
    com.docker.extension.changelog=""

ENV DEBUG_CTR_VERSION=0.2.0
RUN apk add curl
RUN curl -LO "https://github.com/felipecruz91/debug-ctr/releases/download/v${DEBUG_CTR_VERSION}/debug-ctr_${DEBUG_CTR_VERSION}_darwin_${TARGETARCH}.tar.gz" \
    && tar -xvzf debug-ctr_${DEBUG_CTR_VERSION}_darwin_${TARGETARCH}.tar.gz \
    && mkdir /darwin \
    && chmod +x ./debug-ctr && mv ./debug-ctr /darwin/

COPY docker-compose.yaml .
COPY metadata.json .
COPY docker.svg .
COPY --from=client-builder /ui/build ui
