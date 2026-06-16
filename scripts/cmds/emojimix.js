/**
 * MKBOT Command: emojimix
 * @author Charles MK
 * Mix two emojis using Google's Emoji Kitchen API.
 */

const axios  = require("axios");
const fs     = require("fs-extra");
const path   = require("path");
const stream = require("stream");
const { promisify } = require("util");

const pipeline = promisify(stream.pipeline);

function emojiToCodepoint(emoji) {
  const points = [];
  for (const char of emoji) {
    const cp = char.codePointAt(0);
    if (cp > 0xFFFF) {
      points.push(cp.toString(16));
    } else if (cp !== 0xFE0F && cp !== 0x200D) {
      points.push(cp.toString(16));
    }
  }
  return points.join("-");
}

module.exports = {
  config: {
    name: "emojimix",
    aliases: ["emojikitchen", "mixemoji"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Mix two emojis together",
    category: "fun",
    guide: "{pn} [emoji1] [emoji2]\nExample: /emojimix 😀 🐱",
  },

  onStart: async function ({ message, args }) {
    if (args.length < 2) {
      return message.reply(
        "❌ Please provide two emojis.\n" +
        "Example: /emojimix 😀 🐱"
      );
    }

    const emoji1 = args[0].trim();
    const emoji2 = args[1].trim();

    const cp1 = emojiToCodepoint(emoji1);
    const cp2 = emojiToCodepoint(emoji2);

    // Google Emoji Kitchen URL format
    const today = "20230301"; // a stable date that has many combos
    const url1  = `https://www.gstatic.com/android/keyboard/emojikitchen/${today}/u${cp1}/u${cp1}_u${cp2}.png`;
    const url2  = `https://www.gstatic.com/android/keyboard/emojikitchen/${today}/u${cp2}/u${cp2}_u${cp1}.png`;

    const tryUrl = async (url) => {
      const res = await axios({ url, method: "GET", responseType: "stream", timeout: 8000 });
      return res;
    };

    const tmpPath = path.join(process.cwd(), "tmp", `emojimix_${Date.now()}.png`);
    fs.ensureDirSync(path.dirname(tmpPath));

    let downloaded = false;
    for (const url of [url1, url2]) {
      try {
        const res = await tryUrl(url);
        await pipeline(res.data, fs.createWriteStream(tmpPath));
        downloaded = true;
        break;
      } catch {}
    }

    if (!downloaded) {
      return message.reply(
        `❌ No mix available for ${emoji1} + ${emoji2}.\n` +
        `Try different emojis!`
      );
    }

    await message.reply({
      body: `${emoji1} + ${emoji2} = 🎨`,
      attachment: fs.createReadStream(tmpPath),
    });

    fs.removeSync(tmpPath);
  },
};
