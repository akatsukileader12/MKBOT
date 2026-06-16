/**
 * MKBOT Command: confess
 * @author Charles MK
 * Send an anonymous confession to the group.
 */

module.exports = {
  config: {
    name: "confess",
    aliases: ["anonymous", "anon"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Send an anonymous confession to the group",
    category: "fun",
    guide: "{pn} [message] — post anonymously to the group",
  },

  onStart: async function ({ message, args, event, api }) {
    const text = args.join(" ").trim();
    if (!text) return message.reply("❌ Provide a message to confess.\nExample: /confess I secretly like pineapple pizza.");

    // Delete the trigger message for full anonymity
    try { await api.unsendMessage(event.messageID); } catch {}

    await api.sendMessage(
      `🤫 𝗔𝗡𝗢𝗡𝗬𝗠𝗢𝗨𝗦 𝗖𝗢𝗡𝗙𝗘𝗦𝗦𝗜𝗢𝗡\n━━━━━━━━━━━━━━━━━━\n"${text}"\n━━━━━━━━━━━━━━━━━━\n🔒 Anonymous | MKBOT`,
      event.threadID
    );
  },
};
