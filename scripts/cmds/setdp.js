/**
 * MKBOT Command: setdp
 * @author Charles MK
 * Change the group icon/profile picture.
 * Reply to an image or provide an image URL.
 */

const axios  = require("axios");
const fs     = require("fs-extra");
const path   = require("path");
const stream = require("stream");
const { promisify } = require("util");

const pipeline = promisify(stream.pipeline);

module.exports = {
  config: {
    name: "setdp",
    aliases: ["seticon", "groupdp", "setgroupdp"],
    version: "1.0",
    author: "Charles MK",
    role: 2,
    shortDescription: "Change the group profile picture",
    category: "group",
    guide: "{pn} — reply to an image to set it as group icon\n{pn} [url] — use image from URL",
  },

  onStart: async function ({ message, args, event, api }) {
    if (!event.isGroup) {
      return message.reply("❌ This command only works in groups.");
    }

    let imgUrl = args[0];

    // Check if replying to an image
    if (!imgUrl && event.messageReply?.attachments?.length) {
      const att = event.messageReply.attachments.find(a =>
        a.type === "photo" || a.type === "sticker"
      );
      if (att) imgUrl = att.url || att.previewUrl || att.largePreviewUrl;
    }

    if (!imgUrl) {
      return message.reply(
        "❌ Please reply to an image or provide an image URL.\n" +
        "Usage: /setdp — reply to a photo"
      );
    }

    const tmpPath = path.join(process.cwd(), "tmp", `groupdp_${Date.now()}.jpg`);
    fs.ensureDirSync(path.dirname(tmpPath));

    try {
      const res = await axios({ url: imgUrl, method: "GET", responseType: "stream", timeout: 12000 });
      await pipeline(res.data, fs.createWriteStream(tmpPath));

      await api.changeGroupImage(fs.createReadStream(tmpPath), event.threadID);
      fs.removeSync(tmpPath);

      return message.reply("✅ Group icon updated successfully!");
    } catch (err) {
      try { fs.removeSync(tmpPath); } catch {}
      return message.reply(`❌ Failed to change group icon: ${err.message}\n(Bot must be an admin.)`);
    }
  },
};
