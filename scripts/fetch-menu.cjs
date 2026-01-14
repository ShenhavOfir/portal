const fs = require("fs");
const path = require("path");
const https = require("https");

const langs = [
  { key: "he", file: "menu-he.json" }, // רק עברית
];

const saveDir = path.join(__dirname, "../src/json-translations");

function fetchMenu(lang) {
  const url = `https://eve4userver.evepro365.com/api/GetFullMenu?key=${lang.key}`;
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            if (!data || data.trim() === "") {
              console.warn(`⚠️ No data returned for ${lang.key}, skipping.`);
              return resolve({ lang: lang.key, status: "skipped" });
            }

            const parsed = JSON.parse(data);
            if (!fs.existsSync(saveDir)) {
              fs.mkdirSync(saveDir, { recursive: true });
            }
            const filePath = path.join(saveDir, lang.file);
            fs.writeFileSync(filePath, JSON.stringify(parsed, null, 2), "utf8");
            console.log(`✅ Menu for ${lang.key} saved to ${filePath}`);
            resolve({ lang: lang.key, status: "ok" });
          } catch (e) {
            reject(`❌ Error parsing or saving ${lang.key}: ${e}`);
          }
        });
      })
      .on("error", (err) => {
        reject(`❌ Request failed for ${lang.key}: ${err.message}`);
      });
  });
}

async function fetchAllMenus() {
  if (!fs.existsSync(saveDir)) {
    fs.mkdirSync(saveDir, { recursive: true });
  }

  try {
    const results = await Promise.all(langs.map(fetchMenu));
    console.log("📝 Menu fetch results:", results);
  } catch (err) {
    console.error("❌ Error fetching menus:", err);
    process.exit(1);
  }
}

fetchAllMenus();
