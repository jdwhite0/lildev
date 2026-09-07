#!/usr/bin/env node
/**
 * Fail-closed production guard for lildev.world.
 *
 * Public `/` must stay the Coming Soon waitlist (human front door).
 * The marketing homepage lives at /home. Deep links stay open — do not
 * require the access key to browse /home or interior pages.
 *
 * Google may crawl and index the content tree. Do not restore the PR #28
 * GSC lockdown (robots Disallow of sections, root-only sitemap, noindex,
 * X-Robots-Tag). Do not copy home.html over index.html.
 *
 * Required:
 *   - index.html is the waitlist (JOIN THE WAITLIST + email-streams subscribe)
 *   - optional access-key escape still unlocks /home (lildev_access_key === angel)
 *   - vercel.json does not rewrite/redirect `/` to /home
 *   - sitemap lists https://lildev.world/ plus slashless public section URLs
 *     (final 200 URLs only — trailing-slash locs 308 under trailingSlash: false)
 *   - robots.txt Allows the content tree; junk (/_docs, /_experiments) may be Disallow
 *   - home.html and interiors are indexable and do not key-bounce to /
 *
 * Runs as:
 *   - Vercel installCommand (COMPANIES/lil-dev/website is the project root)
 *   - GitHub Actions (.github/workflows/lildev-waitlist-guard.yml)
 *   - Claude Code PreToolUse hook (.claude/hooks/vercel-deploy-guard.sh)
 *
 * Do **not** use buildCommand for this check — that switches a static site
 * onto a build-output path (same lesson as landing_page/guard-jdp-planet.mjs).
 *
 * Exit 0 = allow deploy. Any other exit = block.
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const indexPath = join(here, 'index.html');
const soonPath = join(here, 'soon.html');
const homePath = join(here, 'home.html');
const vercelPath = join(here, 'vercel.json');
const robotsPath = join(here, 'robots.txt');
const sitemapPath = join(here, 'sitemap.xml');

const PUBLIC_SITEMAP_PATHS = [
  'https://lildev.world/',
  'https://lildev.world/meet-lil-dev',
  'https://lildev.world/the-world',
  'https://lildev.world/adventures',
  'https://lildev.world/characters',
  'https://lildev.world/games',
];

const CONTENT_DISALLOW_REGRESSION = [
  '/home',
  '/meet-lil-dev',
  '/the-world',
  '/adventures',
  '/characters',
  '/games',
  '/learn',
  '/parents',
];

const INDEXABLE_PAGES = [
  join(here, 'home.html'),
  join(here, 'meet-lil-dev/index.html'),
  join(here, 'the-world/index.html'),
  join(here, 'adventures/index.html'),
  join(here, 'characters/index.html'),
  join(here, 'games/index.html'),
  join(here, 'games/racer/index.html'),
  join(here, 'games/racer/play.html'),
];

function fail(msg) {
  console.error(`Lil Dev waitlist guard FAILED: ${msg}`);
  console.error('  Production for lildev.world must keep `/` as the waitlist front door.');
  console.error('  Do not serve the marketing homepage at `/`. Preview it at /home.');
  console.error('  Deep links stay open. Google may crawl/index the content tree.');
  console.error('  See COMPANIES/lil-dev/website/WAITLIST_GATE.md.');
  process.exit(1);
}

function readRequired(path) {
  if (!existsSync(path)) fail(`missing ${path}`);
  return readFileSync(path, 'utf8');
}

function parseJson(path) {
  const raw = readRequired(path);
  try {
    return JSON.parse(raw);
  } catch (err) {
    fail(`${path} is not valid JSON (${err.message})`);
  }
}

function isRootSource(source) {
  return source === '/' || source === '/index' || source === '/index.html';
}

function destinationOpensMarketing(destination) {
  if (typeof destination !== 'string') return false;
  const dest = destination.split('?')[0].replace(/\/$/, '') || '/';
  return dest === '/home' || dest === '/home.html';
}

function hasNoindex(html) {
  return /name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html)
    || /content=["'][^"']*noindex[^"']*["'][^>]+name=["']robots["']/i.test(html);
}

function bouncesWithoutKey(html) {
  return /lildev_access_key[\s\S]{0,220}!==\s*["']angel["'][\s\S]{0,120}location\.(?:replace|assign|href)/.test(html)
    || /lildev_access_key[\s\S]{0,220}!=\s*["']angel["'][\s\S]{0,120}location\.(?:replace|assign|href)/.test(html);
}

const html = readRequired(indexPath);

if (!/JOIN THE WAITLIST/.test(html)) {
  fail('index.html is not the waitlist — missing JOIN THE WAITLIST');
}
if (!/Coming Soon/.test(html)) {
  fail('index.html is not the waitlist — missing Coming Soon');
}
if (!/getaccess\.world\/api\/public\/email-streams\/subscribe/.test(html)) {
  fail('index.html is missing the getaccess.world email-streams subscribe call');
}
if (!/stream\s*:\s*['"]lildev['"]/.test(html)) {
  fail("index.html subscribe payload must send stream: 'lildev'");
}
if (!/lildev_access_key/.test(html) || !/["']angel["']/.test(html) || !/["']\/home["']/.test(html)) {
  fail('index.html must keep the access-key escape (lildev_access_key === angel → /home)');
}
if (!/rel=["']canonical["'][^>]+href=["']https:\/\/lildev\.world\/["']/.test(html)) {
  fail('index.html canonical must be https://lildev.world/');
}

const marketingFingerprints = [
  /Waking up Angel/,
  /Start Exploring!/,
  /WORLD MAP — CHOOSE YOUR ZONE/,
  /id=["']loader["']/,
];
for (const fingerprint of marketingFingerprints) {
  if (fingerprint.test(html)) {
    fail(`index.html looks like the open marketing homepage (${fingerprint})`);
  }
}

const vercel = parseJson(vercelPath);
if (vercel.trailingSlash !== false) {
  fail('vercel.json must set trailingSlash: false (racer paths assume slashless clean URLs)');
}
if (vercel.cleanUrls !== true) {
  fail('vercel.json must keep cleanUrls: true');
}

const routeRules = [...(vercel.redirects || []), ...(vercel.rewrites || [])];
for (const rule of routeRules) {
  if (isRootSource(rule.source) && destinationOpensMarketing(rule.destination)) {
    fail(`vercel.json sends / to ${rule.destination} — that reopens the marketing homepage`);
  }
  if (isRootSource(rule.source) && rule.destination && rule.destination !== '/' && rule.destination !== '/index.html') {
    fail(`vercel.json must not rewrite/redirect / away from the waitlist index (found destination ${rule.destination})`);
  }
}

const headerBlob = JSON.stringify(vercel.headers || []);
if (/X-Robots-Tag/i.test(headerBlob) && /noindex/i.test(headerBlob)) {
  fail('vercel.json must not send X-Robots-Tag noindex (PR #28 lockdown is reversed)');
}

const robots = readRequired(robotsPath);
if (!/Allow:\s*\//.test(robots)) {
  fail('robots.txt must Allow: /');
}
if (!/Disallow:\s*\/_docs\b/.test(robots)) {
  fail('robots.txt should Disallow junk path /_docs');
}
if (!/Disallow:\s*\/_experiments\b/.test(robots)) {
  fail('robots.txt should Disallow junk path /_experiments');
}
for (const path of CONTENT_DISALLOW_REGRESSION) {
  if (new RegExp(`Disallow:\\s*${path.replace('/', '\\/')}\\b`).test(robots)) {
    fail(`robots.txt must not Disallow ${path} — Google may crawl/index the content tree`);
  }
}

const sitemap = readRequired(sitemapPath);
const locs = [...sitemap.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)].map((m) => m[1].trim());
if (!locs.includes('https://lildev.world/')) {
  fail('sitemap.xml must include https://lildev.world/');
}
if (locs.length < 8) {
  fail('sitemap.xml must list the public section tree, not root-only');
}
for (const loc of PUBLIC_SITEMAP_PATHS) {
  if (!locs.includes(loc)) {
    fail(`sitemap.xml must include ${loc}`);
  }
}
for (const loc of locs) {
  const path = loc.replace(/^https:\/\/lildev\.world/, '');
  if (path !== '/' && path.endsWith('/')) {
    fail(`sitemap.xml loc must be the final 200 URL (no trailing slash): ${loc}`);
  }
}

const home = readRequired(homePath);
if (hasNoindex(home)) {
  fail('home.html must not include robots noindex — /home is indexable');
}
if (bouncesWithoutKey(home)) {
  fail('home.html must not bounce visitors without the access key — deep links stay open');
}
if (/rel=["']canonical["'][^>]+href=["']https:\/\/lildev\.world\/["']/.test(home)) {
  fail('home.html must not claim the root canonical https://lildev.world/');
}

for (const pagePath of INDEXABLE_PAGES) {
  const page = readRequired(pagePath);
  if (hasNoindex(page)) {
    fail(`${pagePath} must not include robots noindex`);
  }
  if (bouncesWithoutKey(page)) {
    fail(`${pagePath} must not key-bounce unauthenticated humans to /`);
  }
}

const soon = readRequired(soonPath);
if (!/rel=["']canonical["'][^>]+href=["']https:\/\/lildev\.world\/["']/.test(soon)) {
  fail('soon.html canonical must point at https://lildev.world/');
}

console.log('Lil Dev waitlist guard OK — / is the waitlist; deep links stay open; content tree is crawlable.');
process.exit(0);
