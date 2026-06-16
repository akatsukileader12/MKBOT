/**
 * MKBOT Command: broadcast
 * @author Charles MK
 * Send a message to all known threads. Dev only.
 */

module.exports = {
  config: {
    name: "broadcast",
    aliases: ["bc", "announce"],
    version: "1.0",
    author: "Charles MK",
    role: 3,
    shortDescription: "Broadcast a message to all threads (dev only)",
    category: "system",
    guide: "{pn} [message]",
  },

  onStart: async function ({ message, args, api }) {
    const text = args.join(" ").trim();
    if (!text) return message.reply("❌ Provide a message to broadcast.");

    const threads = global.db.allThreadData || [];
    if (!threads.length) {
      return message.reply("❌ No threads in database. Run the bot longer to accumulate thread data.");
    }

    await message.reply(`📢 Broadcasting to ${threads.length} threads...`);

    let sent = 0, failed = 0;
    for (const thread of threads) {
      try {
        await api.sendMessage(
          `📢 𝗕𝗥𝗢𝗔𝗗𝗖𝗔𝗦𝗧\n━━━━━━━━━━━━━━━━━━\n${text}\n━━━━━━━━━━━━━━━━━━\n🤖 MKBOT by Charles MK`,
          thread.threadID
        );
        sent++;
        await new Promise(r => setTimeout(r, 500)); // rate limit
      } catch {
        failed++;
      }
    }

    return message.reply(
      `✅ 𝗕𝗥𝗢𝗔𝗗𝗖𝗔𝗦𝗧 𝗗𝗢𝗡𝗘\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `✅ Sent   : ${sent}\n` +
      `❌ Failed : ${failed}`
    );
  },
};
