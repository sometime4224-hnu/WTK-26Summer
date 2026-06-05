const fs = require("node:fs");
const path = require("node:path");

const rootDir = path.resolve(__dirname, "..");
const targetRoots = [
  "index.html",
  "c10",
  "c11",
  "c12",
  "c13",
  "c14",
  "c15",
  "c16",
  "c17",
  "c18",
  "review",
  "apps"
];

const skipDirs = new Set([
  ".git",
  ".codex_tmp",
  "assets",
  "backup",
  "node_modules",
  "output",
  "test-results",
  "tmp"
]);

function walk(targetPath, files) {
  const stat = fs.statSync(targetPath);
  if (stat.isFile()) {
    if (targetPath.toLowerCase().endsWith(".html")) files.push(targetPath);
    return;
  }

  if (!stat.isDirectory()) return;
  const name = path.basename(targetPath);
  if (skipDirs.has(name)) return;

  for (const entry of fs.readdirSync(targetPath)) {
    walk(path.join(targetPath, entry), files);
  }
}

function detectEol(content) {
  return content.includes("\r\n") ? "\r\n" : "\n";
}

function scriptSrcFor(filePath) {
  const fromDir = path.dirname(filePath);
  const target = path.join(rootDir, "shared", "page-qr.js");
  let relative = path.relative(fromDir, target).replace(/\\/g, "/");
  if (!relative.startsWith(".")) relative = `./${relative}`;
  return relative;
}

function insertScript(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  if (content.includes("shared/page-qr.js")) return { status: "skip-existing" };

  const bodyCloseMatch = /<\/body\s*>/i.exec(content);
  if (!bodyCloseMatch) return { status: "skip-no-body" };

  const eol = detectEol(content);
  const src = scriptSrcFor(filePath);
  const scriptLine = `    <script src="${src}"></script>${eol}`;
  const index = bodyCloseMatch.index;
  const next = content.slice(0, index) + scriptLine + content.slice(index);
  fs.writeFileSync(filePath, next, "utf8");
  return { status: "inserted" };
}

const files = [];
for (const target of targetRoots) {
  const targetPath = path.join(rootDir, target);
  if (fs.existsSync(targetPath)) walk(targetPath, files);
}

const summary = new Map();
for (const file of files.sort()) {
  const result = insertScript(file);
  summary.set(result.status, (summary.get(result.status) || 0) + 1);
}

for (const [status, count] of summary.entries()) {
  console.log(`${status}: ${count}`);
}
