# syntax=docker/dockerfile:1
FROM golang:1.25 AS builder
WORKDIR /app

COPY go.mod go.sum ./
RUN --mount=type=cache,target=/root/.cache/go-build \
    --mount=type=cache,target=/go/pkg/mod \
    go mod download

COPY . .
RUN --mount=type=cache,target=/root/.cache/go-build \
    --mount=type=cache,target=/go/pkg/mod \
    go build -tags=sqlite_fts5,sqlite_json,sqlite_foreign_keys,sqlite_vtable -o musenalm .

FROM debian:bookworm-slim
WORKDIR /app
COPY --from=builder /app/musenalm ./
COPY --from=builder /app/scripts ./scripts
EXPOSE 8090
CMD ["./scripts/run.sh"]
