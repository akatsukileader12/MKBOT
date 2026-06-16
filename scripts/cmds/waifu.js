/**
 * MKBOT Command: waifu
 * @author Charles MK
 * Fetch a random waifu/anime image using waifu.pics.
 */

const axios  = require("axios");
const fs     = require("fs-extra");
const path   = require("path");
const stream = require("stream");
const { promisify } = require("util");

const pipeline = promisify(stream.pipeline);

const SFW_TYPES = ["waifu","neko","shinobu","megumin","bully","cuddle","cry","hug","awoo","kiss","lick","pat","smug","bonk","yeet","blush","smile","wave","highfive","handhold","nom","bite","slap","happy","wink","poke","dance","cringe"];

module.exports = {
  config: {
    name: "waifu",
    aliases: ["anime", "neko", "animegirl"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Get a random anime/waifu image",
    category: "fun",
    guide: "{pn} — random waifu\n{pn} [type] — waifu/neko/hug/kiss/pat/etc\n{pn} list — show all types",
  },

  onStart: async function ({ message, args }) {
    const sub = (args[0] || "").toLowerCase();

    if (sub === "list") {
      return message.reply(
        `🌸 𝗔𝗩𝗔𝗜𝗟𝗔𝗕𝗟𝗘 𝗧𝗬𝗣𝗘𝗦\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        SFW_TYPES.join(", ")
      );
    }

    const type = SFW_TYPES.includes(sub) ? sub : "waifu";

    try {
      const { data } = await axios.get(
        `https://api.waifu.pics/sfw/${type}`,
        { timeout: 10000 }
      );

      const imgUrl  = data?.url;
      if (!imgUrl) return message.reply("❌ Could not fetch image. Try again!");

      const ext     = imgUrl.split(".").pop().split("?")[0] || "gif";
      const tmpPath = path.join(process.cwd(), "tmp", `waifu_${Date.now()}.${ext}`);
      fs.ensureDirSync(path.dirname(tmpPath));

      const res = await axios({ url: imgUrl, method: "GET", responseType: "stream", timeout: 15000 });
      await pipeline(res.data, fs.createWriteStream(tmpPath));

      await message.reply({
        body: `🌸 ${type.charAt(0).toUpperCase() + type.slice(1)} | MKBOT by Charles MK`,
        attachment: fs.createReadStream(tmpPath),
      });

      fs.removeSync(tmpPath);
    } catch (err) {
      return message.reply("❌ Failed to fetch image. Try again!");
    }
  },
};
