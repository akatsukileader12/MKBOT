/**
 * MKBOT Command: avatar
 * @author Charles MK
 * Get a user's Facebook profile picture.
 */

const axios  = require("axios");
const fs     = require("fs-extra");
const path   = require("path");
const stream = require("stream");
const { promisify } = require("util");

const pipeline = promisify(stream.pipeline);

module.exports = {
  config: {
    name: "avatar",
    aliases: ["pfp", "dp", "profilepic"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Get someone's Facebook profile picture",
    category: "utility",
    guide: "{pn} — your avatar\n{pn} @mention — their avatar\n{pn} [userID] — by ID",
  },

  onStart: async function ({ message, args, event, api }) {
    const mentions = Object.keys(event.mentions || {});
    const targetID = mentions[0] || args[0] || event.senderID;

    if (isNaN(targetID)) {
      return message.reply("❌ Invalid user ID.");
    }

    const picUrl = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

    try {
      const tmpPath = path.join(process.cwd(), "tmp", `avatar_${targetID}.jpg`);
      fs.ensureDirSync(path.dirname(tmpPath));

      const res = await axios({ url: picUrl, method: "GET", responseType: "stream", timeout: 10000 });
      await pipeline(res.data, fs.createWriteStream(tmpPath));

      await message.reply({
        body: `🖼️ Profile picture of ${targetID}`,
        attachment: fs.createReadStream(tmpPath),
      });

      fs.removeSync(tmpPath);
    } catch (err) {
      return message.reply(`❌ Could not fetch avatar: ${err.message}`);
    }
  },
};
