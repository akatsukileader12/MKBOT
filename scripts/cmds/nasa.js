/**
 * MKBOT Command: nasa
 * @author Charles MK
 * Get NASA's Astronomy Picture of the Day (APOD).
 * Uses the demo key — set NASA_API_KEY env var for higher rate limits.
 */

const axios  = require("axios");
const fs     = require("fs-extra");
const path   = require("path");
const stream = require("stream");
const { promisify } = require("util");

const pipeline = promisify(stream.pipeline);

module.exports = {
  config: {
    name: "nasa",
    aliases: ["apod", "spaceimg", "space"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "NASA Astronomy Picture of the Day",
    category: "utility",
    guide: "{pn} — today's NASA APOD",
  },

  onStart: async function ({ message }) {
    const apiKey = process.env.NASA_API_KEY || "DEMO_KEY";

    try {
      const { data } = await axios.get(
        `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`,
        { timeout: 10000 }
      );

      const title  = data.title || "NASA APOD";
      const date   = data.date;
      const expl   = (data.explanation || "").slice(0, 600);
      const imgUrl = data.url;

      let body =
        `🌌 𝗡𝗔𝗦𝗔 𝗔𝗣𝗢𝗗\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `📛 ${title}\n` +
        `📅 ${date}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `${expl}...\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `🤖 MKBOT by Charles MK`;

      if (data.media_type === "image" && imgUrl) {
        const tmpPath = path.join(process.cwd(), "tmp", `nasa_${Date.now()}.jpg`);
        fs.ensureDirSync(path.dirname(tmpPath));
        try {
          const res = await axios({ url: imgUrl, method: "GET", responseType: "stream", timeout: 15000 });
          await pipeline(res.data, fs.createWriteStream(tmpPath));
          await message.reply({ body, attachment: fs.createReadStream(tmpPath) });
          fs.removeSync(tmpPath);
          return;
        } catch {}
      }

      return message.reply(body + (imgUrl ? `\n🔗 ${imgUrl}` : ""));
    } catch (err) {
      return message.reply("❌ NASA API unavailable. Try again later.");
    }
  },
};
