/**
 * MKBOT Command: balance
 * @author Charles MK
 */

module.exports = {
  config: {
    name: "balance",
    aliases: ["bal", "money", "wallet"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Check your balance",
    category: "economy",
    guide: "{pn} — check your balance\n{pn} @mention — check someone else's balance",
  },

  onStart: async function ({ message, event, usersData }) {
    const mentions  = Object.keys(event.mentions || {});
    const targetID  = mentions[0] || event.senderID;
    const user      = await usersData.get(targetID);
    const isSelf    = targetID === event.senderID;

    message.reply(
      `💰 𝗪𝗔𝗟𝗟𝗘𝗧\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `👤 User   : ${user.name || targetID}\n` +
      `💵 Balance: ${(user.money || 0).toLocaleString()} coins\n` +
      `⭐ EXP    : ${(user.exp || 0).toLocaleString()}\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `🤖 MKBOT Economy`
    );
  },
};
