/**
 * MKBOT Command: genpic
 * @author Charles MK
 * Generate/fetch a random image by category using Unsplash (no key needed for random).
 */

const axios  = require("axios");
const fs     = require("fs-extra");
const path   = require("path");
const stream = require("stream");
const { promisify } = require("util");

const pipeline = promisify(stream.pipeline);

module.exports = {
  config: {
    name: "genpic",
    aliases: ["randompic", "randomphoto", "unsplash"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Get a random photo by category",
    category: "media",
    guide: "{pn} [category?]\nExample: {pn} nature\nExample: {pn} city",
  },

  onStart: async function ({ message, args }) {
    const query = args.join(" ") || "nature";
    const url   = `https://source.unsplash.com/800x600/?${encodeURIComponent(query)}`;

    const tmpPath = path.join(process.cwd(), "tmp", `pic_${Date.now()}.jpg`);
    fs.ensureDirSync(path.dirname(tmpPath));

    try {
      const res = await axios({
        url,
        method: "GET",
        responseType: "stream",
        timeout: 15000,
        maxRedirects: 5,
      });

      await pipeline(res.data, fs.createWriteStream(tmpPath));

      await message.reply({
        body: `📸 Random photo: "${query}"\n🤖 MKBOT by Charles MK`,
        attachment: fs.createReadStream(tmpPath),
      });

      fs.removeSync(tmpPath);
    } catch (err) {
      try { fs.removeSync(tmpPath); } catch {}
      return message.reply(`❌ Could not fetch photo for "${query}".`);
    }
  },
};
