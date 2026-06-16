/**
 * MKBOT Command: cat
 * @author Charles MK
 * Get a random cat image.
 */

const axios  = require("axios");
const fs     = require("fs-extra");
const path   = require("path");
const stream = require("stream");
const { promisify } = require("util");

const pipeline = promisify(stream.pipeline);

module.exports = {
  config: {
    name: "cat",
    aliases: ["cats", "kitten", "meow"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Get a random cat photo",
    category: "fun",
    guide: "{pn} — random cat photo",
  },

  onStart: async function ({ message }) {
    const tmpPath = path.join(process.cwd(), "tmp", `cat_${Date.now()}.jpg`);
    fs.ensureDirSync(path.dirname(tmpPath));

    try {
      const { data } = await axios.get(
        "https://api.thecatapi.com/v1/images/search",
        { timeout: 8000 }
      );

      const imgUrl = data?.[0]?.url;
      if (!imgUrl) throw new Error("No image");

      const res = await axios({ url: imgUrl, method: "GET", responseType: "stream", timeout: 10000 });
      await pipeline(res.data, fs.createWriteStream(tmpPath));

      await message.reply({
        body: "🐱 Meow! | MKBOT by Charles MK",
        attachment: fs.createReadStream(tmpPath),
      });

      fs.removeSync(tmpPath);
    } catch {
      try { fs.removeSync(tmpPath); } catch {}
      return message.reply("❌ Could not fetch cat image. Try again!");
    }
  },
};
