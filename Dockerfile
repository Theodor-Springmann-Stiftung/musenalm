# syntax=docker/dockerfile:1
FROM golang:1.26 AS builder
WORKDIR /app

COPY go.mod go.sum ./
RUN --mount=type=cache,target=/root/.cache/go-build \
    --mount=type=cache,target=/go/pkg/mod \
    go mod download

COPY . .
RUN --mount=type=cache,target=/root/.cache/go-build \
    --mount=type=cache,target=/go/pkg/mod \
    go build -tags=sqlite_fts5,sqlite_json,sqlite_foreign_keys,sqlite_vtable -o musenalm .
RUN mkdir -p /runtime/scripts /runtime/views \
    && cp /app/musenalm /runtime/ \
    && cp /app/config.dev.json /runtime/ \
    && if [ -f /app/config.json ]; then cp /app/config.json /runtime/; fi \
    && cp -r /app/scripts/. /runtime/scripts/ \
    && cp -r /app/views/public /runtime/views/

FROM debian:bookworm-slim
WORKDIR /app
RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates \
    && rm -rf /var/lib/apt/lists/*
COPY --from=builder /runtime/. /app/
EXPOSE 8090
CMD ["./scripts/run.sh"]
