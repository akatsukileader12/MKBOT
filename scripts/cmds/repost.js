/**
 * MKBOT Command: repost
 * @author Charles MK
 * Repost/forward a replied message to the current thread (or another thread by ID).
 */

module.exports = {
  config: {
    name: "repost",
    aliases: ["forward", "fwd"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Repost a replied message",
    category: "utility",
    guide: "Reply to a message then use {pn} — repost it here",
  },
  onStart: async function ({ message, event, api }) {
    if (!event.messageReply) return message.reply("❌ Reply to a message to repost it.");
    const rep = event.messageReply;
    const body = rep.body || "";
    const atts  = rep.attachments || [];
    try {
      if (atts.length) {
        const axios  = require("axios");
        const fs     = require("fs-extra");
        const path   = require("path");
        const stream = require("stream");
        const pipeline = require("util").promisify(stream.pipeline);
        const files = [];
        for (const att of atts.slice(0,4)) {
          const url = att.url || att.previewUrl || att.largePreviewUrl;
          if (!url) continue;
          const tmp = path.join(process.cwd(), "tmp", `repost_${Date.now()}.jpg`);
          fs.ensureDirSync(path.dirname(tmp));
          const res = await axios({ url, method: "GET", responseType: "stream", timeout: 10000 });
          await pipeline(res.data, fs.createWriteStream(tmp));
          files.push({ tmp, stream: fs.createReadStream(tmp) });
        }
        await message.reply({ body: body ? `📤 ${body}` : "📤 Reposted", attachment: files.map(f => f.stream) });
        for (const f of files) { try { fs.removeSync(f.tmp); } catch {} }
      } else {
        await message.reply(`📤 ${body}`);
      }
    } catch (err) {
      return message.reply(`❌ Repost failed: ${err.message}`);
    }
  },
};
