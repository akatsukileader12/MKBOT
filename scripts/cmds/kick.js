/**
 * MKBOT Command: kick
 * @author Charles MK
 * Removes a user from the group. Bot must be admin.
 */

module.exports = {
  config: {
    name: "kick",
    aliases: ["remove"],
    version: "1.0",
    author: "Charles MK",
    role: 1,
    shortDescription: "Kick a user from the group",
    category: "group",
    guide: "{pn} @mention [reason?]",
  },

  onStart: async function ({ message, args, event, api }) {
    const mentions = Object.keys(event.mentions || {});
    const targetID = mentions[0] || args[0];

    if (!targetID) {
      return message.reply("❌ Please @mention or provide the ID of the user to kick.");
    }

    if (String(targetID) === String(global.GoatBot.botID)) {
      return message.reply("❌ I can't kick myself!");
    }

    const reason = args.slice(1).join(" ") || "No reason provided";

    try {
      await api.removeUserFromGroup(targetID, event.threadID);
      message.reply(
        `👢 𝗨𝗦𝗘𝗥 𝗞𝗜𝗖𝗞𝗘𝗗\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `👤 User ID : ${targetID}\n` +
        `📝 Reason  : ${reason}`
      );
    } catch (err) {
      message.reply(`❌ Failed to kick user: ${err.message}\n(Make sure the bot is an admin of this group.)`);
    }
  },
};
