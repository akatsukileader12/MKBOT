/**
 * MKBOT Command: unrestrict
 * @author Charles MK
 * Remove a restriction from a user.
 */

module.exports = {
  config: {
    name: "unrestrict",
    aliases: ["unmute"],
    version: "1.0",
    author: "Charles MK",
    role: 1,
    shortDescription: "Unrestrict a user — restore bot access",
    category: "admin",
    guide: "{pn} @mention",
  },

  onStart: async function ({ message, args, event, threadsData }) {
    const mentions = Object.keys(event.mentions || {});
    const targetID = mentions[0] || args[0];

    if (!targetID) {
      return message.reply("❌ @mention or provide the ID of a user to unrestrict.");
    }

    const thread = await threadsData.get(event.threadID);
    const restricted = new Set(thread?.restricted || []);

    if (!restricted.has(String(targetID))) {
      return message.reply(`ℹ️ User ${targetID} is not restricted in this thread.`);
    }

    restricted.delete(String(targetID));
    await threadsData.set(event.threadID, { restricted: [...restricted] });

    return message.reply(
      `✅ 𝗨𝗦𝗘𝗥 𝗨𝗡𝗥𝗘𝗦𝗧𝗥𝗜𝗖𝗧𝗘𝗗\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `👤 User  : ${targetID}\n` +
      `✅ They can use bot commands again.`
    );
  },
};
