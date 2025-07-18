require("dotenv").config();
const fs = require("fs");
const path = require("path");
const fetch = global.fetch || require("node-fetch");

async function fetchAllPaginatedData(
  baseUrl = `https://islandproperty.haspcms.net/api/contents/properties/entries`,
  outputFile = "properties.json"
) {
  let allData = [];
  let page = 1;

  let condition = true;

  while (condition) {
    const url = `${baseUrl}?page%5Bnumber%5D=${page}`;
    console.log(`📡 Fetching page ${page}...`);

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status} on page ${page}`);

      const json = await res.json();

      const entries = json.data;
      if (!entries || entries.length === 0) {
        console.log("🚧 No more entries. Stopping.");
        break;
      }

      allData.push(...entries);
      page++;
    } catch (err) {
      console.error(`❌ Error fetching page ${page}:`, err.message);
      break;
    }
  }

  try {
    const filePath = path.join(__dirname, outputFile);
    fs.writeFileSync(filePath, JSON.stringify(allData, null, 2));
    console.log(`✅ Saved ${allData.length} entries to ${filePath}`);
  } catch (err) {
    console.error("❌ Failed to write file:", err.message);
  }
}

fetchAllPaginatedData();
