# Musenalm

Bibliographie deutscher Almanache des 18. und 19. Jahrhunderts. Runs as a PocketBase-based web app with SQLite storage.

## Commands

Local build (dev assets + sqlite tags used in this repo):
```bash
./scripts/build.sh
```

Manual build equivalent:
```bash
go build -tags=dev,fts5,sqlite_icu -o ./tmp/musenalm .
```

Run (as used in the Docker image):
```bash
./scripts/run.sh
```

Docker image build:
```bash
./scripts/docker.sh
```

Reset local data directory:
```bash
./scripts/reset.sh
```

Docker Compose (prod/stage):
```bash
docker compose up --build
docker compose -f stage.docker-compose.yml up --build
```

## Build prerequisites

- Go 1.24 (see `go.mod`, also used in `Dockerfile`).
- SQLite build tags used in this repo:
  - Local/dev build: `dev,fts5,sqlite_icu` (see `scripts/build.sh`).
  - Docker build: `sqlite_fts5,sqlite_json,sqlite_foreign_keys,sqlite_vtable` (see `Dockerfile`).
- The `dev` build tag serves templates/assets from disk (no embedding). Without it, assets are embedded into the binary.

## Configuration

Config files are loaded in this order, later values override earlier ones:
1) `config.dev.json` (dev defaults)
2) `config.json` (runtime overrides)
3) Environment variables with prefix `MUSENALM_`

### Options

`debug` (bool)  
Enables PocketBase dev mode and, unless `disable_watchers` is true, turns on template watchers.

`allow_test_login` (bool)  
Creates/keeps a test superuser account (`demo@example.com` / `password`). When false, the test account is removed if present.

`disable_watchers` (bool)  
Disables template watchers even if `debug` is true.

Environment variable equivalents:
- `MUSENALM_DEBUG`
- `MUSENALM_ALLOW_TEST_LOGIN`
- `MUSENALM_DISABLE_WATCHERS`

## Hosting

### Docker (recommended)

`docker-compose.yml` runs the app on port 8090 and persists data in `/app/data/pb_data` via an external volume.

Prereqs:
```bash
docker volume create musenalm
docker network create caddynet
```

Start:
```bash
docker compose up --build
```

Stage uses `stage.docker-compose.yml` and a separate external volume `musenalmstage`.

### Bare binary

Build the binary, then run it with a data directory:
```bash
./tmp/musenalm serve --http=0.0.0.0:8090 --dir=/path/to/pb_data
```

