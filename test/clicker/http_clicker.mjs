import { setTimeout as sleep } from "node:timers/promises";
import { performance } from "node:perf_hooks";

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const idx = args.indexOf(`--${name}`);
  if (idx === -1 || idx + 1 >= args.length) return fallback;
  return args[idx + 1];
};

const baseUrl = getArg("base", "http://localhost:8090/");
const workers = Number.parseInt(getArg("workers", "50"), 10);
const steps = Number.parseInt(getArg("steps", "200"), 10);
const minDelay = Number.parseInt(getArg("minDelay", "200"), 10);
const maxDelay = Number.parseInt(getArg("maxDelay", "2000"), 10);
const timeout = Number.parseInt(getArg("timeout", "8000"), 10);
const reportEvery = Number.parseInt(getArg("reportEvery", "50"), 10);
const progressEvery = Number.parseInt(getArg("progressEvery", "0"), 10);
const maxPool = Number.parseInt(getArg("maxPool", "500"), 10);
const maxTextBytes = Number.parseInt(getArg("maxTextBytes", "1048576"), 10);
const maxConcurrent = Number.parseInt(getArg("maxConcurrent", "6"), 10);
const minConcurrent = Number.parseInt(getArg("minConcurrent", "2"), 10);
const dropChance = Number.parseFloat(getArg("dropChance", "0.05"));
const concurrencyJitterSteps = Number.parseInt(getArg("concurrencyJitterSteps", "25"), 10);
const fetchImages = getArg("fetchImages", "1") !== "0";
const imageChance = Number.parseFloat(getArg("imageChance", "0.25"));
const maxImagePool = Number.parseInt(getArg("maxImagePool", "500"), 10);
const fetchAssets = getArg("fetchAssets", "1") !== "0";
const assetChance = Number.parseFloat(getArg("assetChance", "0.2"));
const maxAssetPool = Number.parseInt(getArg("maxAssetPool", "500"), 10);
const warmupMs = Number.parseInt(getArg("warmupMs", "15000"), 10);
const warmupConcurrent = Number.parseInt(getArg("warmupConcurrent", "1"), 10);

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const sleepRand = () => sleep(rand(minDelay, maxDelay));

const pool = [];
const poolSet = new Set();
const imagePool = [];
const imagePoolSet = new Set();
const assetPool = [];
const assetPoolSet = new Set();

const isSafeHref = (href) => {
  if (!href) return false;
  const raw = href.trim();
  if (!raw || raw.startsWith("#")) return false;
  if (raw.startsWith("mailto:")) return false;
  if (raw.startsWith("javascript:")) return false;
  return true;
};

const isSafePath = (path) => {
  const p = path.toLowerCase();
  if (p.includes("logout") || p.includes("delete") || p.includes("/login")) return false;
  return true;
};

const addToPool = (url) => {
  if (poolSet.has(url)) return;
  if (pool.length >= maxPool) return;
  poolSet.add(url);
  pool.push(url);
};

const addToImagePool = (url) => {
  if (imagePoolSet.has(url)) return;
  if (imagePool.length >= maxImagePool) return;
  imagePoolSet.add(url);
  imagePool.push(url);
};

const addToAssetPool = (url) => {
  if (assetPoolSet.has(url)) return;
  if (assetPool.length >= maxAssetPool) return;
  assetPoolSet.add(url);
  assetPool.push(url);
};

const pickFromPool = () => {
  if (!pool.length) return baseUrl;
  return pool[rand(0, pool.length - 1)];
};

const pickImage = () => {
  if (!imagePool.length) return null;
  return imagePool[rand(0, imagePool.length - 1)];
};

const pickAsset = () => {
  if (!assetPool.length) return null;
  return assetPool[rand(0, assetPool.length - 1)];
};

const extractLinks = (html, origin, base) => {
  const links = [];
  const images = [];
  const assets = [];
  const re = /href\s*=\s*["']([^"']+)["']/gi;
  let match;
  while ((match = re.exec(html)) !== null) {
    const href = match[1];
    if (!isSafeHref(href)) continue;
    try {
      const url = new URL(href, base);
      if (url.origin !== origin) continue;
      const path = `${url.pathname}${url.search}`;
      if (!isSafePath(path)) continue;
      links.push(url.toString());
    } catch {
      // ignore bad urls
    }
  }
  const imgRe = /<img[^>]+src\s*=\s*["']([^"']+)["']/gi;
  while ((match = imgRe.exec(html)) !== null) {
    const src = match[1];
    if (!isSafeHref(src)) continue;
    try {
      const url = new URL(src, base);
      if (url.origin !== origin) continue;
      images.push(url.toString());
    } catch {
      // ignore bad urls
    }
  }
  const scriptRe = /<script[^>]+src\s*=\s*["']([^"']+)["']/gi;
  while ((match = scriptRe.exec(html)) !== null) {
    const src = match[1];
    if (!isSafeHref(src)) continue;
    try {
      const url = new URL(src, base);
      if (url.origin !== origin) continue;
      assets.push(url.toString());
    } catch {
      // ignore bad urls
    }
  }
  const cssRe = /<link[^>]+rel\\s*=\\s*["']stylesheet["'][^>]*href\\s*=\\s*["']([^"']+)["']/gi;
  while ((match = cssRe.exec(html)) !== null) {
    const href = match[1];
    if (!isSafeHref(href)) continue;
    try {
      const url = new URL(href, base);
      if (url.origin !== origin) continue;
      assets.push(url.toString());
    } catch {
      // ignore bad urls
    }
  }
  return { links, images, assets };
};

const stats = {
  count: 0,
  errors: 0,
  totalMs: 0,
  minMs: Infinity,
  maxMs: 0,
  samples: [],
  sampleMax: 5000,
};

const addSample = (ms) => {
  stats.count += 1;
  stats.totalMs += ms;
  if (ms < stats.minMs) stats.minMs = ms;
  if (ms > stats.maxMs) stats.maxMs = ms;
  if (stats.samples.length < stats.sampleMax) {
    stats.samples.push(ms);
  } else {
    const idx = rand(0, stats.count - 1);
    if (idx < stats.sampleMax) stats.samples[idx] = ms;
  }
};

const percentile = (arr, p) => {
  if (!arr.length) return null;
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.floor((sorted.length - 1) * p);
  return sorted[idx];
};

const report = () => {
  const avg = stats.count ? stats.totalMs / stats.count : 0;
  const p50 = percentile(stats.samples, 0.5);
  const p95 = percentile(stats.samples, 0.95);
  console.log(
    `report: count=${stats.count} errors=${stats.errors} avg=${avg.toFixed(1)}ms min=${stats.minMs.toFixed(1)}ms max=${stats.maxMs.toFixed(1)}ms p50=${p50?.toFixed(1)}ms p95=${p95?.toFixed(1)}ms pool=${pool.length}`,
  );
};

const fetchWithTimeout = async (url) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const start = performance.now();
  try {
    const res = await fetch(url, { signal: controller.signal, headers: { "user-agent": "http-clicker" } });
    const elapsed = performance.now() - start;
    addSample(elapsed);
    if (!res.ok) {
      stats.errors += 1;
      console.log(`error: ${url} status=${res.status}`);
    }

    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("text/html")) {
      const buf = await res.arrayBuffer();
      const sliced = buf.byteLength > maxTextBytes ? buf.slice(0, maxTextBytes) : buf;
      const text = new TextDecoder("utf-8", { fatal: false }).decode(sliced);
      const { links, images, assets } = extractLinks(text, new URL(baseUrl).origin, res.url);
      for (const link of links) addToPool(link);
      if (fetchImages) {
        for (const img of images) addToImagePool(img);
      }
      if (fetchAssets) {
        for (const asset of assets) addToAssetPool(asset);
      }
    }
  } catch (error) {
    stats.errors += 1;
    const reason = error?.name || "error";
    console.log(`error: ${url} ${reason}`);
  } finally {
    clearTimeout(id);
  }
};

const runWorker = async (id) => {
  const label = `worker-${id}`;
  let currentMax = warmupConcurrent;
  let inWarmup = warmupMs > 0;
  const inFlight = new Set();
  if (inWarmup) {
    setTimeout(() => {
      inWarmup = false;
    }, warmupMs);
  }
  for (let i = 0; i < steps; i += 1) {
    if (!inWarmup && concurrencyJitterSteps > 0 && i % concurrencyJitterSteps === 0) {
      currentMax = rand(minConcurrent, maxConcurrent);
    }
    if (Math.random() < dropChance) {
      await sleepRand();
      continue;
    }
    while (inFlight.size < currentMax) {
      let url = pickFromPool();
      if (fetchImages && Math.random() < imageChance) {
        url = pickImage() || url;
      } else if (fetchAssets && Math.random() < assetChance) {
        url = pickAsset() || url;
      }
      const task = fetchWithTimeout(url).finally(() => inFlight.delete(task));
      inFlight.add(task);
      if (inFlight.size >= currentMax) break;
      if (Math.random() < 0.5) break;
    }
    if (progressEvery > 0 && (i + 1) % progressEvery === 0) {
      console.log(`${label}: step ${i + 1}/${steps}`);
    }
    await sleepRand();
  }
  await Promise.allSettled(Array.from(inFlight));
};

const main = async () => {
  addToPool(baseUrl);
  const startedAt = Date.now();
  const runs = Array.from({ length: workers }, (_, idx) => runWorker(idx + 1));
  const reporter = setInterval(report, Math.max(1000, reportEvery * 50));
  try {
    await Promise.all(runs);
  } finally {
    clearInterval(reporter);
    const elapsedMs = Date.now() - startedAt;
    const elapsedSec = Math.round(elapsedMs / 1000);
    console.log(`runtime: ${elapsedSec}s`);
    report();
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
