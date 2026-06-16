/**
 * MKBOT Command: react
 * @author Charles MK
 * React to the replied-to message with a specified emoji.
 */

const VALID_REACTIONS = {
  love: "❤️", haha: "😆", wow: "😮", sad: "😢",
  angry: "😡", like: "👍", dislike: "👎", care: "🥰",
  fire: "🔥", clap: "👏", pray: "🙏", flex: "💪",
};

module.exports = {
  config: {
    name: "react",
    aliases: ["reaction"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "React to a message",
    category: "utility",
    guide: "{pn} [emoji/name] — react to a replied message\n{pn} list — show available reactions",
  },

  onStart: async function ({ message, args, event, api }) {
    const sub = (args[0] || "").toLowerCase();

    if (sub === "list") {
      const lines = Object.entries(VALID_REACTIONS).map(([k, v]) => `${v} ${k}`);
      return message.reply(
        `🎭 𝗔𝗩𝗔𝗜𝗟𝗔𝗕𝗟𝗘 𝗥𝗘𝗔𝗖𝗧𝗜𝗢𝗡𝗦\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        lines.join("\n")
      );
    }

    // Determine target message
    const targetID = event.messageReply?.messageID || event.messageID;

    // Determine emoji
    let emoji = VALID_REACTIONS[sub] || args[0];
    if (!emoji) emoji = "❤️";

    try {
      await api.setMessageReaction(emoji, targetID, () => {}, true);
      // No reply needed — silent reaction
    } catch (err) {
      return message.reply(`❌ Failed to react: ${err.message}`);
    }
  },
};
