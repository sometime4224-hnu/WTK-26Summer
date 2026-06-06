const { test, expect } = require("@playwright/test");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "../..");
const skipPathPattern = /(?:^|[\\/])(?:\.git|node_modules|test-results|output|tmp|backup|tests|\.codex_tmp)(?:[\\/]|$)/;
const specialGoogleFontPattern = /(Black\+Han\+Sans|Cormorant\+Garamond|Do\+Hyeon|Orbitron|IBM\+Plex|Nanum|Gowun|Jua|Poor\+Story)/i;

function walk(dir, predicate, out = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (skipPathPattern.test(fullPath)) continue;
        if (entry.isDirectory()) {
            walk(fullPath, predicate, out);
        } else if (entry.isFile() && predicate(fullPath)) {
            out.push(fullPath);
        }
    }
    return out;
}

function relative(filePath) {
    return path.relative(repoRoot, filePath).replace(/\\/g, "/");
}

function htmlFiles() {
    return walk(repoRoot, (filePath) => filePath.toLowerCase().endsWith(".html"));
}

function textFiles() {
    return walk(repoRoot, (filePath) => /\.(?:html|css|js)$/i.test(filePath));
}

test("static pages keep external render-blocking resources under control", () => {
    const violations = [];

    for (const filePath of htmlFiles()) {
        const source = fs.readFileSync(filePath, "utf8");
        const fileLabel = relative(filePath);
        const googleFontLinks = [...source.matchAll(/<link\b(?=[^>]*href=["']https:\/\/fonts\.googleapis\.com\/css2\?)[^>]*>/gi)].map((match) => match[0]);
        const fontPreconnects = [...source.matchAll(/<link\b(?=[^>]*rel=["']preconnect["'])(?=[^>]*href=["']https:\/\/fonts\.(?:googleapis|gstatic)\.com["'])[^>]*>/gi)].map((match) => match[0]);
        const fontAwesomeLinks = [...source.matchAll(/<link\b(?=[^>]*font-awesome)(?=[^>]*rel=["']stylesheet["'])[^>]*>/gi)].map((match) => match[0]);
        const tailwindScripts = [...source.matchAll(/<script\b(?=[^>]*src=["']https:\/\/cdn\.tailwindcss\.com["'])[^>]*><\/script>/gi)].map((match) => match[0]);

        for (const link of googleFontLinks) {
            if (!specialGoogleFontPattern.test(link)) {
                violations.push(`${fileLabel}: remove Noto-only Google Fonts link`);
            }
        }

        if (googleFontLinks.length === 0 && fontPreconnects.length > 0) {
            violations.push(`${fileLabel}: remove unused Google Fonts preconnect`);
        }

        for (const link of fontAwesomeLinks) {
            if (!/\bmedia=["']print["']/i.test(link) || !/\bonload=/i.test(link)) {
                violations.push(`${fileLabel}: load Font Awesome asynchronously`);
            }
        }

        for (const script of tailwindScripts) {
            if (!/\b(?:defer|async)\b/i.test(script)) {
                violations.push(`${fileLabel}: defer Tailwind CDN script`);
            }
        }
    }

    expect(violations).toEqual([]);
});

test("image markup uses async decoding and lazy loading by default", () => {
    const violations = [];

    for (const filePath of htmlFiles()) {
        const source = fs.readFileSync(filePath, "utf8");
        const fileLabel = relative(filePath);
        const imageTags = [...source.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0]);

        for (const tag of imageTags) {
            if (!/\bdecoding\s*=/i.test(tag)) {
                violations.push(`${fileLabel}: missing decoding on ${tag.slice(0, 120)}`);
            }
            if (!/\b(?:loading|fetchpriority)\s*=/i.test(tag)) {
                violations.push(`${fileLabel}: missing loading/fetchpriority on ${tag.slice(0, 120)}`);
            }
        }
    }

    expect(violations).toEqual([]);
});

test("heavy image references point at optimized derivatives", () => {
    const bannedReferences = [
        "lesson15-listening1-cuttoon.webp",
        "lesson15-listening2-cuttoon.webp",
        "lesson15-listening1-cover.webp",
        "lesson15-listening2-cover.webp",
        "lesson16-listening1-cuttoon.png",
        "lesson16-listening2-cuttoon.png",
        "lesson17-listening1-cuts.webp",
        "lesson17-listening2-cuts.webp",
        "korea-region-map.png",
        "vietnam-region-map.png",
        "photo_market.webp",
        "photo_living_room.webp",
        "photo_cafe.webp",
        "photo_han_river.webp",
        "photo_restaurant.webp",
        "park-bench-scene.webp",
        "cafe-conversation-scene.webp",
        "living-room-cat-scene.webp"
    ];
    const violations = [];

    for (const filePath of textFiles()) {
        const source = fs.readFileSync(filePath, "utf8");
        const fileLabel = relative(filePath);
        for (const reference of bannedReferences) {
            if (source.includes(reference)) {
                violations.push(`${fileLabel}: still references ${reference}`);
            }
        }
    }

    expect(violations).toEqual([]);
});
