/**
 * MKBOT Command: rename
 * @author Charles MK
 * Rename the group chat.
 */

module.exports = {
  config: {
    name: "rename",
    aliases: ["setname", "groupname"],
    version: "1.0",
    author: "Charles MK",
    role: 1,
    shortDescription: "Rename the group",
    category: "group",
    guide: "{pn} [new name]",
  },

  onStart: async function ({ message, args, event, api }) {
    if (!event.isGroup) {
      return message.reply("❌ This command only works in groups.");
    }

    const newName = args.join(" ").trim();
    if (!newName) {
      return message.reply("❌ Please provide a new group name.\nExample: /rename MKBOT Squad");
    }

    if (newName.length > 100) {
      return message.reply("❌ Group name must be 100 characters or less.");
    }

    try {
      await api.setTitle(newName, event.threadID);
      return message.reply(
        `✅ 𝗚𝗥𝗢𝗨𝗣 𝗥𝗘𝗡𝗔𝗠𝗘𝗗\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `📝 New name: ${newName}\n` +
        `🤖 Changed by MKBOT`
      );
    } catch (err) {
      return message.reply(
        `❌ Failed to rename group: ${err.message}\n` +
        `(Make sure the bot is an admin.)`
      );
    }
  },
};
