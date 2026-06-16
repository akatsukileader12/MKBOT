/**
 * MKBOT Command: uid
 * @author Charles MK
 * Get your user ID, a mentioned user's ID, or the thread ID.
 */

module.exports = {
  config: {
    name: "uid",
    aliases: ["id", "userid", "getid"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Get user ID or thread ID",
    category: "utility",
    guide: "{pn} — your ID\n{pn} @mention — their ID\n{pn} thread — this thread's ID",
  },

  onStart: async function ({ message, args, event }) {
    const sub = (args[0] || "").toLowerCase();

    if (sub === "thread" || sub === "tid" || sub === "group") {
      return message.reply(
        `🆔 𝗧𝗛𝗥𝗘𝗔𝗗 𝗜𝗗\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `📌 Thread ID: ${event.threadID}\n` +
        `📝 Type: ${event.isGroup ? "Group" : "Direct Message"}`
      );
    }

    const mentions = Object.keys(event.mentions || {});

    if (mentions.length > 0) {
      const lines = mentions.map((id, i) => `👤 ${event.mentions[id] || `User ${i+1}`}: ${id}`);
      return message.reply(
        `🆔 𝗨𝗦𝗘𝗥 𝗜𝗗𝗦\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        lines.join("\n")
      );
    }

    return message.reply(
      `🆔 𝗬𝗢𝗨𝗥 𝗜𝗗\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `👤 User ID : ${event.senderID}\n` +
      `💬 Thread  : ${event.threadID}\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Use ${global.GoatBot.config?.prefix || "/"}uid thread — to get the thread ID`
    );
  },
};
