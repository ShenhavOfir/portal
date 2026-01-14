const fs = require("fs");
const path = require("path");
const https = require("https");
const { API_FULL_URL } = require("./apiConfig.cjs");

const langs = [
  { key: "he", file: "he.json" },
  { key: "eng", file: "eng.json" },
];

const saveDir = path.join(__dirname, "../src/json-translations");

function fetchLang(lang) {
  const url = `${API_FULL_URL}/GetLanguageObjectByKey?key=${lang.key}`;
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            const parsed = JSON.parse(data);
            const filePath = path.join(saveDir, lang.file);
            fs.writeFileSync(filePath, JSON.stringify(parsed, null, 2), "utf8");
            resolve({ lang: lang.key, status: "ok" });
          } catch (e) {
            reject(`Error parsing or saving ${lang.key}: ${e}`);
          }
        });
      })
      .on("error", (err) => {
        reject(`Request failed for ${lang.key}: ${err.message}`);
      });
  });
}

async function fetchAll() {
  if (!fs.existsSync(saveDir)) {
    fs.mkdirSync(saveDir, { recursive: true });
  }

  try {
    const results = await Promise.all(langs.map(fetchLang));
    console.log("✅ Translations fetched:", results);
  } catch (err) {
    console.error("❌ Error fetching translations:", err);
    process.exit(1);
  }
}

fetchAll();
