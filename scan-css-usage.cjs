const fs = require("fs");
const path = require("path");

const CSS_FILE = path.join(__dirname, "src", "styles", "global.css");

const CODE_DIR = path.join(__dirname, "src"); // ← תיקיית קוד לסריקה
const extensions = [".js", ".jsx", ".ts", ".tsx", ".html", ".cjs"]; // מה לסרוק

const args = process.argv.slice(2);
const ONLY_USED = args.includes("--only-used");       // מציג רק קלאסים שבאמת נמצאו בקוד
const SINGLE_USE = args.includes("--single-use");     // מציג רק קלאסים שמופיעים בקובץ יחיד
const SHOW_SUGGEST = args.includes("--suggest");      // מציע לאיזה CSS להעביר

function getClassNamesFromCSS(cssPath) {
  const content = fs.readFileSync(cssPath, "utf-8");
  // חשוב: לא לתפוס מספרים עשרוניים כמו "0.2s" או סיומות קבצים כמו ".css" בהערות.
  // לכן דורשים שהנקודה תהיה חלק מסלקטור, וששם הקלאס יתחיל באות/underscore.
  const classRegex = /(^|[\s,{>+~])\.([a-zA-Z_][a-zA-Z0-9_-]*)/gm;
  const classNames = new Set();
  let match;
  while ((match = classRegex.exec(content))) {
    classNames.add(match[2]);
  }
  return Array.from(classNames);
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isMatchWholeToken(content, token) {
  // כדי להימנע מ-false positives של substring (למשל "btn" בתוך "btn-purple")
  // נבדוק שהטוקן לא מוקף בתווים שמותריים בתוך שם class (אות/מספר/_/-)
  const re = new RegExp(`(^|[^a-zA-Z0-9_-])${escapeRegex(token)}([^a-zA-Z0-9_-]|$)`);
  return re.test(content);
}

function toRel(p) {
  return path.relative(__dirname, p).replaceAll("\\", "/");
}

function suggestCssTarget(fileRel) {
  // Page/component name heuristic: Foo.jsx -> src/styles/Foo.css
  // Supports: src/pages/Foo.jsx, src/components/Foo.jsx
  const parsed = path.parse(fileRel);
  const baseName = parsed.name; // Foo
  const candidate = `src/styles/${baseName}.css`;
  const abs = path.join(__dirname, candidate);
  if (fs.existsSync(abs)) return candidate;
  return null;
}

function scanFilesForClassUsage(dir, classNames, usageMap = {}) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      scanFilesForClassUsage(fullPath, classNames, usageMap);
    } else if (extensions.includes(path.extname(entry.name))) {
      const content = fs.readFileSync(fullPath, "utf-8");
      for (const className of classNames) {
        if (isMatchWholeToken(content, className)) {
          if (!usageMap[className]) usageMap[className] = new Set();
          usageMap[className].add(fullPath);
        }
      }
    }
  }
  return usageMap;
}

function main() {
  if (!fs.existsSync(CSS_FILE)) {
    console.error("⚠️ global.css not found!");
    return;
  }

  const classNames = getClassNamesFromCSS(CSS_FILE);
  const usageMap = scanFilesForClassUsage(CODE_DIR, classNames);

  console.log(`\n📊 CSS Class Usage Report (${toRel(CSS_FILE)}):\n`);
  console.log(`Flags: ${[ONLY_USED && "--only-used", SINGLE_USE && "--single-use", SHOW_SUGGEST && "--suggest"].filter(Boolean).join(" ") || "(none)"}\n`);

  const rows = classNames
    .map((className) => {
      const files = Array.from(usageMap[className] ?? []).map(toRel).sort();
      return { className, count: files.length, files };
    })
    .filter((r) => (ONLY_USED ? r.count > 0 : true))
    .filter((r) => (SINGLE_USE ? r.count === 1 : true))
    .sort((a, b) => a.className.localeCompare(b.className));

  for (const r of rows) {
    console.log(`${r.className.padEnd(30)} → ${r.count} file(s)`);
    for (const f of r.files) console.log(`  - ${f}`);

    if (SHOW_SUGGEST && r.count === 1) {
      const target = suggestCssTarget(r.files[0]);
      if (target) console.log(`  ↳ suggest move to: ${target}`);
    }
  }

  console.log("\n✅ Done.\n");
  console.log("Tip: node .\\scan-css-usage.cjs --only-used --single-use --suggest\n");
}

main();
