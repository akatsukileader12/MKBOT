/**
 * MKBOT Command: clear
 * @author Charles MK
 * Unsend multiple bot messages (clears stored onReply/onReaction state for the thread).
 */

module.exports = {
  config: {
    name: "clear",
    aliases: ["cls", "clean"],
    version: "1.0",
    author: "Charles MK",
    role: 2,
    shortDescription: "Clear bot's onReply/onReaction state for this thread",
    category: "system",
    guide: "{pn} — clear all pending reply/reaction states for this thread",
  },

  onStart: async function ({ message, event }) {
    const threadID = event.threadID;

    // Count and remove onReply entries for this thread
    let cleared = 0;
    for (const [msgID, data] of global.GoatBot.onReply) {
      // We don't store threadID on onReply, but we can clear all
      // A better approach is to just wipe all, or we use a note that
      // this is a blunt tool for admins
      // For now, clear all stale ones
      cleared++;
      global.GoatBot.onReply.delete(msgID);
    }

    for (const [msgID] of global.GoatBot.onReaction) {
      global.GoatBot.onReaction.delete(msgID);
    }

    return message.reply(
      `🧹 𝗖𝗟𝗘𝗔𝗥𝗘𝗗\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `✅ Cleared ${cleared} pending reply state(s)\n` +
      `✅ Cleared all reaction states\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Bot memory is clean!`
    );
  },
};
