// Minimal WooCommerce helper used by build-time code and the serverless proxy.
// Keeps all WooCommerce fetching in one place so pagination and error handling are consistent.
import fs from 'fs';
import path from 'path';

type EnvLike = { [k: string]: any } | undefined;

function parseDotEnvFile(filePath: string): Record<string, string> {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const out: Record<string, string> = {};
    for (const line of content.split(/\r?\n/)) {
      const t = line.trim();
      if (!t || t.startsWith('#')) continue;
      const idx = t.indexOf('=');
      if (idx === -1) continue;
      const key = t.slice(0, idx).trim();
      let val = t.slice(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      out[key] = val;
    }
    return out;
  } catch (err) {
    return {};
  }
}

function resolveEnv(envArg?: EnvLike) {
  // 1) if caller provided an env-like object (e.g., import.meta.env), use it
  if (envArg && envArg.WOOCOMMERCE_API_URL && envArg.WOOCOMMERCE_CONSUMER_KEY && envArg.WOOCOMMERCE_CONSUMER_SECRET) {
    return envArg as Record<string, string>;
  }
  // 2) if process.env has the values (server/runtime), use it
  if (process.env.WOOCOMMERCE_API_URL && process.env.WOOCOMMERCE_CONSUMER_KEY && process.env.WOOCOMMERCE_CONSUMER_SECRET) {
    return process.env as unknown as Record<string, string>;
  }
  // 3) try to read .env from project root (useful for local dev where build didn't load env into process)
  try {
    const root = process.cwd();
    const file = path.join(root, '.env');
    const parsed = parseDotEnvFile(file);
    if (parsed.WOOCOMMERCE_API_URL && parsed.WOOCOMMERCE_CONSUMER_KEY && parsed.WOOCOMMERCE_CONSUMER_SECRET) return parsed;
  } catch (e) {
    // ignore
  }
  return {} as Record<string, string>;
}

function buildBase(envArg?: EnvLike) {
  const env = resolveEnv(envArg);
  const WOOCOMMERCE_API_URL = env.WOOCOMMERCE_API_URL;
  if (!WOOCOMMERCE_API_URL) throw new Error('WooCommerce env vars missing');
  return (WOOCOMMERCE_API_URL || '').replace(/\/+$/, '');
}

async function fetchJson(url: string) {
  const res = await fetch(url);
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    const err: any = new Error('WooCommerce fetch failed: ' + res.status);
    err.status = res.status;
    err.body = txt;
    throw err;
  }
  return res.json();
}

export async function fetchProductsPage(page = 1, per_page = 100, envArg?: EnvLike) {
  const env = resolveEnv(envArg);
  const WOOCOMMERCE_API_URL = env.WOOCOMMERCE_API_URL;
  const WOOCOMMERCE_CONSUMER_KEY = env.WOOCOMMERCE_CONSUMER_KEY;
  const WOOCOMMERCE_CONSUMER_SECRET = env.WOOCOMMERCE_CONSUMER_SECRET;
  const base = (WOOCOMMERCE_API_URL || '').replace(/\/+$/, '');
  if (!base || !WOOCOMMERCE_CONSUMER_KEY || !WOOCOMMERCE_CONSUMER_SECRET) throw new Error('WooCommerce env vars missing');
  const endpoint = `${base}/products?per_page=${per_page}&page=${page}&consumer_key=${WOOCOMMERCE_CONSUMER_KEY}&consumer_secret=${WOOCOMMERCE_CONSUMER_SECRET}`;
  return fetchJson(endpoint);
}

export async function fetchAllProductSlugs(per_page = 100, envArg?: EnvLike) {
  const slugs: string[] = [];
  let page = 1;
  while (true) {
    const list = await fetchProductsPage(page, per_page, envArg);
    if (!Array.isArray(list) || list.length === 0) break;
    for (const p of list) {
      if (p && p.slug) slugs.push(p.slug);
    }
    if (list.length < per_page) break; // last page
    page += 1;
  }
  return slugs;
}

export async function fetchProductBySlug(slug: string, envArg?: EnvLike) {
  if (!slug) return null;
  const env = resolveEnv(envArg);
  const WOOCOMMERCE_API_URL = env.WOOCOMMERCE_API_URL;
  const WOOCOMMERCE_CONSUMER_KEY = env.WOOCOMMERCE_CONSUMER_KEY;
  const WOOCOMMERCE_CONSUMER_SECRET = env.WOOCOMMERCE_CONSUMER_SECRET;
  const base = (WOOCOMMERCE_API_URL || '').replace(/\/+$/, '');
  if (!base || !WOOCOMMERCE_CONSUMER_KEY || !WOOCOMMERCE_CONSUMER_SECRET) throw new Error('WooCommerce env vars missing');
  const endpoint = `${base}/products?slug=${encodeURIComponent(slug)}&consumer_key=${WOOCOMMERCE_CONSUMER_KEY}&consumer_secret=${WOOCOMMERCE_CONSUMER_SECRET}`;
  const arr = await fetchJson(endpoint);
  return Array.isArray(arr) && arr.length ? arr[0] : null;
}
