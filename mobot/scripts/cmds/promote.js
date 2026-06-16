/**
 * MKBOT Command: promote
 * @author Charles MK
 * Promote a user to group admin.
 */

module.exports = {
  config: {
    name: "promote",
    aliases: ["addadmin"],
    version: "1.0",
    author: "Charles MK",
    role: 2,
    shortDescription: "Promote a user to group admin",
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
      return message.reply("❌ @mention someone to promote.");
    }

    try {
      await api.changeAdminStatus(event.threadID, targetID, true);
      return message.reply(
        `👑 𝗨𝗦𝗘𝗥 𝗣𝗥𝗢𝗠𝗢𝗧𝗘𝗗\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `👤 User  : ${targetID}\n` +
        `⬆️ Role  : Group Admin\n` +
        `✅ Done by MKBOT`
      );
    } catch (err) {
      return message.reply(`❌ Failed to promote: ${err.message}\n(Bot must be an admin.)`);
    }
  },
};
