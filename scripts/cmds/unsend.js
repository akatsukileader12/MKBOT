/**
 * MKBOT Command: unsend
 * @author Charles MK
 * Unsend/delete the bot's last message in the thread, or any message the bot sent (by reply).
 */

module.exports = {
  config: {
    name: "unsend",
    aliases: ["delete", "delmsg", "recall"],
    version: "1.0",
    author: "Charles MK",
    role: 1,
    shortDescription: "Unsend the bot's last message or a replied-to bot message",
    category: "utility",
    guide: "{pn} — delete bot's last message\nReply to a bot message with {pn} — delete that message",
  },

  onStart: async function ({ message, args, event, api }) {
    const botID = String(global.GoatBot.botID);

    // If replying to a message
    if (event.messageReply) {
      const replyMsg = event.messageReply;
      if (String(replyMsg.senderID) !== botID) {
        return message.reply("❌ I can only delete my own messages.");
      }
      try {
        await api.unsendMessage(replyMsg.messageID);
        // Also delete the command message itself
        try { await api.unsendMessage(event.messageID); } catch {}
      } catch (err) {
        return message.reply(`❌ Failed to unsend: ${err.message}`);
      }
      return;
    }

    // Otherwise: delete last bot message in the thread
    // We track this via global.client.cache
    const lastMsgID = global.client.cache?.[`lastBotMsg_${event.threadID}`];
    if (!lastMsgID) {
      return message.reply("❌ No recent bot message to delete in this thread.");
    }

    try {
      await api.unsendMessage(lastMsgID);
      delete global.client.cache[`lastBotMsg_${event.threadID}`];
      try { await api.unsendMessage(event.messageID); } catch {}
    } catch (err) {
      return message.reply(`❌ Failed to unsend: ${err.message}`);
    }
  },
};
