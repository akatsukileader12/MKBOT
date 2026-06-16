/**
 * MKBOT Command: sticker
 * @author Charles MK
 * Convert a replied image into a sticker (sends back as a sticker).
 */

module.exports = {
  config: {
    name: "sticker",
    aliases: ["makesticker", "toSticker"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Convert an image to a sticker",
    category: "media",
    guide: "Reply to an image with {pn} — converts it to a sticker",
  },
  onStart: async function ({ message, event, api }) {
    const rep = event.messageReply;
    if (!rep?.attachments?.length) return message.reply("❌ Reply to an image to convert it to a sticker.");

    const att = rep.attachments.find(a => ["photo","sticker","image"].includes(a.type));
    if (!att) return message.reply("❌ Couldn't find an image in the replied message.");

    const url = att.url || att.previewUrl || att.largePreviewUrl;
    if (!url) return message.reply("❌ No image URL found.");

    const axios  = require("axios");
    const fs     = require("fs-extra");
    const path   = require("path");
    const stream = require("stream");
    const pipeline = require("util").promisify(stream.pipeline);

    const tmpPath = path.join(process.cwd(), "tmp", `sticker_${Date.now()}.png`);
    fs.ensureDirSync(path.dirname(tmpPath));

    try {
      const res = await axios({ url, method: "GET", responseType: "stream", timeout: 10000 });
      await pipeline(res.data, fs.createWriteStream(tmpPath));
      await message.reply({
        body: "",
        sticker: fs.createReadStream(tmpPath),
      });
      fs.removeSync(tmpPath);
    } catch (err) {
      try { fs.removeSync(tmpPath); } catch {}
      return message.reply(`❌ Sticker creation failed: ${err.message}`);
    }
  },
};
