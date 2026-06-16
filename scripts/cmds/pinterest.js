/**
 * MKBOT Command: pinterest
 * @author Charles MK
 * Search Pinterest images using a free scraping approach.
 */

const axios  = require("axios");
const fs     = require("fs-extra");
const path   = require("path");
const stream = require("stream");
const { promisify } = require("util");

const pipeline = promisify(stream.pipeline);

module.exports = {
  config: {
    name: "pinterest",
    aliases: ["pin", "pins"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Search Pinterest for images",
    category: "media",
    guide: "{pn} [keyword] — search Pinterest images",
  },

  onStart: async function ({ message, args }) {
    if (!args.length) {
      return message.reply("❌ Please provide a search term.\nExample: /pinterest anime wallpaper");
    }

    const query = args.join(" ");

    try {
      // Use Pinterest RSS/JSON endpoint
      const { data } = await axios.get(
        `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(query)}&rs=typed`,
        {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Accept": "application/json, text/javascript, */*; q=0.01",
            "X-Pinterest-AppState": "active",
          },
          timeout: 12000,
        }
      );

      // Extract image URLs from Pinterest's response
      const imgMatches = String(data).match(/https:\/\/i\.pinimg\.com\/[^\s"\\]+\.jpg/g) || [];
      const uniqueImgs = [...new Set(imgMatches)].slice(0, 6);

      if (!uniqueImgs.length) {
        return message.reply(`❌ No Pinterest images found for "${query}".`);
      }

      // Download and send 3 images
      const toSend = uniqueImgs.slice(0, 3);
      const attachments = [];
      const tmpFiles    = [];

      for (const url of toSend) {
        const tmpPath = path.join(process.cwd(), "tmp", `pin_${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`);
        fs.ensureDirSync(path.dirname(tmpPath));
        try {
          const res = await axios({ url, method: "GET", responseType: "stream", timeout: 10000 });
          await pipeline(res.data, fs.createWriteStream(tmpPath));
          attachments.push(fs.createReadStream(tmpPath));
          tmpFiles.push(tmpPath);
        } catch {}
      }

      if (!attachments.length) {
        return message.reply(`❌ Could not download Pinterest images for "${query}".`);
      }

      await message.reply({
        body: `📌 Pinterest: "${query}" — ${attachments.length} result(s)`,
        attachment: attachments,
      });

      for (const f of tmpFiles) {
        try { fs.removeSync(f); } catch {}
      }
    } catch (err) {
      return message.reply(`❌ Pinterest search failed: ${err.message}`);
    }
  },
};
