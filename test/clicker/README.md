# Clicker

Parallel random-click runner for http://localhost:8090/ using Playwright.

## Setup

From repo root:

```
cd test/clicker
npm install
npx playwright install chromium
```

## Run

Default: 20 workers, 200 steps, 2–30s delay, start at `/reihen`, staggered start, random typing enabled (3–5 chars), random POST submit.

```
cd test/clicker
npm run click
```

Custom:

```
node clicker.mjs --base http://localhost:8090/reihen --workers 20 --steps 300 --minDelay 2000 --maxDelay 30000 --timeout 10000 --startStagger 500 --typeChance 0.25 --enterChance 0.35 --postChance 0.1 --minTypeLen 3 --maxTypeLen 5
```

Notes:
- Filters out logout/delete/login links, external links, mailto/js links.
- Each worker uses a separate browser context.
- HTTP clicker logs error URLs and counts non-2xx responses as errors.

## HTTP clicker

```
cd test/clicker
node http_clicker.mjs --base http://localhost:8090/ --workers 300 --steps 500 --minDelay 50 --maxDelay 500 --timeout 5000 --minConcurrent 2 --maxConcurrent 6 --warmupMs 15000 --warmupConcurrent 1 --fetchImages 1 --imageChance 0.25
```

Flags:
- `--fetchImages 0|1` (default 1): also request `<img src>` URLs discovered in HTML.
- `--imageChance 0..1` (default 0.25): chance a request is an image instead of a page.
- `--maxImagePool` (default 500): max cached image URLs.
- `--fetchAssets 0|1` (default 1): also request `<script src>` and `<link rel="stylesheet">` URLs.
- `--assetChance 0..1` (default 0.2): chance a request is a JS/CSS asset instead of a page.
- `--maxAssetPool` (default 500): max cached asset URLs.
- `--warmupMs` (default 15000): warmup duration before full concurrency.
- `--warmupConcurrent` (default 1): per-worker concurrency during warmup.
- `--progressEvery` (default 0): log per-worker step progress every N steps.
