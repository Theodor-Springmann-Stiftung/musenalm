FROM golang:1.24
WORKDIR /app

COPY . .
RUN go build -tags=sqlite_fts5,sqlite_json,sqlite_foreign_keys,sqlite_vtable
EXPOSE 8090


CMD ["./scripts/run.sh"]

