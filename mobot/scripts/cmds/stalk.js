/**
 * MKBOT Command: stalk
 * @author Charles MK
 * Get basic info about a Facebook user by their ID.
 */

const axios  = require("axios");
const fs     = require("fs-extra");
const path   = require("path");
const stream = require("stream");
const { promisify } = require("util");

const pipeline = promisify(stream.pipeline);

module.exports = {
  config: {
    name: "stalk",
    aliases: ["userinfo", "lookup", "finduser"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Look up a Facebook user's info by ID",
    category: "utility",
    guide: "{pn} @mention — stalk someone\n{pn} [userID] — stalk by ID",
  },

  onStart: async function ({ message, args, event, api, usersData }) {
    const mentions  = Object.keys(event.mentions || {});
    const targetID  = mentions[0] || args[0] || event.senderID;

    if (isNaN(targetID)) {
      return message.reply("❌ Invalid user ID.");
    }

    const wait = await message.reply("🔍 Fetching user info...");

    try {
      // Get user info from fca-unofficial
      const userInfo = await api.getUserInfo(targetID);
      const user     = userInfo?.[targetID];

      // Get from DB
      const dbUser   = await usersData.get(targetID);

      const name      = user?.name || dbUser?.name || "Unknown";
      const vanity    = user?.vanity || "N/A";
      const isFriend  = user?.isFriend ? "Yes" : "No";
      const isVerified = user?.isVerified ? "✅" : "❌";

      // Fetch avatar
      const picUrl  = `https://graph.facebook.com/${targetID}/picture?width=256&height=256&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      const tmpPath = path.join(process.cwd(), "tmp", `stalk_${targetID}.jpg`);
      fs.ensureDirSync(path.dirname(tmpPath));

      let attachment;
      try {
        const res = await axios({ url: picUrl, method: "GET", responseType: "stream", timeout: 8000 });
        await pipeline(res.data, fs.createWriteStream(tmpPath));
        attachment = fs.createReadStream(tmpPath);
      } catch {}

      const msg = {
        body:
          `👤 𝗨𝗦𝗘𝗥 𝗜𝗡𝗙𝗢\n` +
          `━━━━━━━━━━━━━━━━━━\n` +
          `🆔 ID       : ${targetID}\n` +
          `📛 Name     : ${name}\n` +
          `🔗 Username : ${vanity}\n` +
          `✅ Verified : ${isVerified}\n` +
          `👥 Friend   : ${isFriend}\n` +
          `━━━━━━━━━━━━━━━━━━\n` +
          `💵 Money    : $${(dbUser?.money || 0).toLocaleString()}\n` +
          `🏦 Bank     : $${(dbUser?.bankMoney || 0).toLocaleString()}\n` +
          `⚠️ Warns    : ${dbUser?.warns || 0}/3\n` +
          `🚫 Banned   : ${dbUser?.banned ? "Yes" : "No"}\n` +
          `━━━━━━━━━━━━━━━━━━\n` +
          `🤖 MKBOT by Charles MK`,
      };

      if (attachment) msg.attachment = attachment;

      try { await api.unsendMessage(wait.messageID); } catch {}
      await message.reply(msg);

      if (tmpPath && fs.existsSync(tmpPath)) {
        try { fs.removeSync(tmpPath); } catch {}
      }
    } catch (err) {
      try { await api.unsendMessage(wait.messageID); } catch {}
      return message.reply(`❌ Could not fetch user info: ${err.message}`);
    }
  },
};
