/**
 * MKBOT Command: qr
 * @author Charles MK
 * Generate a QR code image from text/URL using a free API.
 */

const axios  = require("axios");
const fs     = require("fs-extra");
const path   = require("path");
const stream = require("stream");
const { promisify } = require("util");

const pipeline = promisify(stream.pipeline);

module.exports = {
  config: {
    name: "qr",
    aliases: ["qrcode", "generateqr"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Generate a QR code from text or URL",
    category: "utility",
    guide: "{pn} [text or URL]\nExample: {pn} https://example.com",
  },

  onStart: async function ({ message, args }) {
    if (!args.length) {
      return message.reply("❌ Please provide text or a URL.\nExample: /qr https://example.com");
    }

    const text = args.join(" ").trim();
    const encoded = encodeURIComponent(text);
    const qrUrl   = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encoded}`;

    const tmpPath = path.join(process.cwd(), "tmp", `qr_${Date.now()}.png`);
    fs.ensureDirSync(path.dirname(tmpPath));

    try {
      const res = await axios({ url: qrUrl, method: "GET", responseType: "stream", timeout: 10000 });
      await pipeline(res.data, fs.createWriteStream(tmpPath));

      await message.reply({
        body: `📱 QR Code for:\n"${text.slice(0, 100)}${text.length > 100 ? "..." : ""}"`,
        attachment: fs.createReadStream(tmpPath),
      });

      fs.removeSync(tmpPath);
    } catch (err) {
      try { fs.removeSync(tmpPath); } catch {}
      return message.reply("❌ Failed to generate QR code. Try again later.");
    }
  },
};
