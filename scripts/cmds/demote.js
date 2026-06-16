/**
 * MKBOT Command: demote
 * @author Charles MK
 * Demote a group admin to regular member.
 */

module.exports = {
  config: {
    name: "demote",
    aliases: ["removeadmin"],
    version: "1.0",
    author: "Charles MK",
    role: 2,
    shortDescription: "Demote a group admin to regular member",
    category: "group",
    guide: "{pn} @mention",
  },

  onStart: async function ({ message, args, event, api }) {
    if (!event.isGroup) {
      return message.reply("❌ This command only works in groups.");
    }

    const mentions = Object.keys(event.mentions || {});
    const targetID = mentions[0] || args[0];

    if (!targetID) {
      return message.reply("❌ @mention someone to demote.");
    }

    if (String(targetID) === String(global.GoatBot.botID)) {
      return message.reply("❌ You can't demote the bot!");
    }

    try {
      await api.changeAdminStatus(event.threadID, targetID, false);
      return message.reply(
        `⬇️ 𝗨𝗦𝗘𝗥 𝗗𝗘𝗠𝗢𝗧𝗘𝗗\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `👤 User  : ${targetID}\n` +
        `⬇️ Role  : Regular Member\n` +
        `✅ Done by MKBOT`
      );
    } catch (err) {
      return message.reply(`❌ Failed to demote: ${err.message}\n(Bot must be an admin.)`);
    }
  },
};
