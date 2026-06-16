/**
 * MKBOT Command: antilink
 * @author Charles MK
 * Enable/disable anti-link protection for the group.
 * When enabled, any message containing a link will result in the user being warned/kicked.
 */

const URL_REGEX = /https?:\/\/[^\s]+|www\.[^\s]+|t\.me\/[^\s]+|fb\.com\/[^\s]+/i;

module.exports = {
  config: {
    name: "antilink",
    aliases: ["antiurl", "nolink"],
    version: "1.0",
    author: "Charles MK",
    role: 2,
    shortDescription: "Enable/disable anti-link protection",
    category: "admin",
    guide: "{pn} on — enable anti-link\n{pn} off — disable anti-link\n{pn} status — check status",
  },

  onStart: async function ({ message, args, event, threadsData }) {
    if (!event.isGroup) {
      return message.reply("❌ This command only works in groups.");
    }

    const sub  = (args[0] || "").toLowerCase();
    const thread = await threadsData.get(event.threadID);

    if (sub === "on" || sub === "enable") {
      await threadsData.set(event.threadID, { antiLink: true });
      return message.reply(
        `🔒 𝗔𝗡𝗧𝗜-𝗟𝗜𝗡𝗞 𝗘𝗡𝗔𝗕𝗟𝗘𝗗\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `🚫 Links are now banned in this group.\n` +
        `⚠️ Users who post links will be warned.\n` +
        `3 warnings = kick.`
      );
    }

    if (sub === "off" || sub === "disable") {
      await threadsData.set(event.threadID, { antiLink: false });
      return message.reply(
        `🔓 𝗔𝗡𝗧𝗜-𝗟𝗜𝗡𝗞 𝗗𝗜𝗦𝗔𝗕𝗟𝗘𝗗\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `✅ Links are now allowed in this group.`
      );
    }

    const status = thread?.antiLink ? "🔒 ON" : "🔓 OFF";
    return message.reply(
      `🔗 𝗔𝗡𝗧𝗜-𝗟𝗜𝗡𝗞 𝗦𝗧𝗔𝗧𝗨𝗦\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Status: ${status}\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Use /antilink on/off to toggle.`
    );
  },

  onChat: async function ({ event, message, api, threadsData, usersData }) {
    if (!event.isGroup) return;
    if (!event.body) return;

    // Skip if sender is admin or dev
    if (global.utils.isAdmin(event.senderID) || global.utils.isDev(event.senderID)) return;

    const thread = await threadsData.get(event.threadID);
    if (!thread?.antiLink) return;

    if (!URL_REGEX.test(event.body)) return;

    // Warn the user
    const user   = await usersData.get(event.senderID);
    const warns  = (user?.warns || 0) + 1;
    await usersData.set(event.senderID, { warns, warnReasons: [...(user?.warnReasons || []), "Posted a link (anti-link)"] });

    if (warns >= 3) {
      try {
        await api.removeUserFromGroup(event.senderID, event.threadID);
        return message.reply(
          `⛔ ${event.senderID} was kicked for posting links!\n` +
          `(3/3 warnings reached)`
        );
      } catch {
        return message.reply(`⚠️ Link detected from ${event.senderID}! (${warns}/3 warnings) — Auto-kick failed.`);
      }
    }

    return message.reply(
      `⚠️ No links allowed here!\n` +
      `👤 ${event.senderID} — Warning ${warns}/3\n` +
      `3 warnings = kick!`
    );
  },
};
