/**
 * MKBOT Command: ask
 * @author Charles MK
 * Ask the group an open question — collect replies in a thread.
 */

module.exports = {
  config: {
    name: "ask",
    aliases: ["openquestion", "qanda"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Ask the group a question and collect answers",
    category: "fun",
    guide: "{pn} [question] — post a question for the group",
  },

  onStart: async function ({ message, args, event, usersData }) {
    const question = args.join(" ").trim();
    if (!question) return message.reply("❌ Provide a question.\nExample: /ask What is your favorite food?");

    const sender = await usersData.get(event.senderID).catch(() => null);
    const name   = sender?.name || event.senderID;

    return message.reply(
      `❓ 𝗢𝗣𝗘𝗡 𝗤𝗨𝗘𝗦𝗧𝗜𝗢𝗡\n━━━━━━━━━━━━━━━━━━\n${question}\n━━━━━━━━━━━━━━━━━━\n📨 Asked by: ${name}\nReply to this message with your answer!`
    );
  },
};
