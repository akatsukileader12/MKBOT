/**
 * MKBOT Command: restrict
 * @author Charles MK
 * Restrict a user — they can't use bot commands in this thread.
 */

module.exports = {
  config: {
    name: "restrict",
    aliases: ["mute"],
    version: "1.0",
    author: "Charles MK",
    role: 1,
    shortDescription: "Restrict a user from using bot commands in this thread",
    category: "admin",
    guide: "{pn} @mention [reason?]",
  },

  onStart: async function ({ message, args, event, threadsData }) {
    const mentions = Object.keys(event.mentions || {});
    const targetID = mentions[0] || args[0];

    if (!targetID) {
      return message.reply("❌ @mention or provide the ID of a user to restrict.");
    }

    if (global.utils.isAdmin(targetID) || global.utils.isDev(targetID)) {
      return message.reply("⛔ You cannot restrict an admin or developer.");
    }

    const reason = args.slice(mentions.length ? 1 : 1).join(" ") || "No reason provided";

    const thread = await threadsData.get(event.threadID);
    const restricted = new Set(thread?.restricted || []);
    restricted.add(String(targetID));

    await threadsData.set(event.threadID, { restricted: [...restricted] });

    return message.reply(
      `🚫 𝗨𝗦𝗘𝗥 𝗥𝗘𝗦𝗧𝗥𝗜𝗖𝗧𝗘𝗗\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `👤 User  : ${targetID}\n` +
      `📝 Reason: ${reason}\n` +
      `🚫 They can no longer use bot commands here.`
    );
  },
};
