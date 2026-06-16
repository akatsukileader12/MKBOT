/**
 * MKBOT Command: listadmin
 * @author Charles MK
 * List all admins in the group.
 */

module.exports = {
  config: {
    name: "listadmin",
    aliases: ["admins", "groupadmins", "la"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "List group admins",
    category: "group",
    guide: "{pn} — list all admins in this group",
  },

  onStart: async function ({ message, event, api }) {
    if (!event.isGroup) {
      return message.reply("❌ This command only works in groups.");
    }

    try {
      const info = await api.getThreadInfo(event.threadID);
      const adminIDs = info.adminIDs || [];

      if (!adminIDs.length) {
        return message.reply("ℹ️ No admins found in this group.");
      }

      const lines = adminIDs.map((obj, i) => {
        const id = obj.id || obj;
        const isBot = id === String(global.GoatBot.botID);
        return `${i + 1}. ${id}${isBot ? " (Bot 🤖)" : ""}`;
      });

      return message.reply(
        `👑 𝗚𝗥𝗢𝗨𝗣 𝗔𝗗𝗠𝗜𝗡𝗦\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `📋 Total: ${adminIDs.length}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        lines.join("\n")
      );
    } catch (err) {
      return message.reply(`❌ Failed to get admin list: ${err.message}`);
    }
  },
};
