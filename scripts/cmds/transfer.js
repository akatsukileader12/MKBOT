/**
 * MKBOT Command: transfer
 * @author Charles MK
 * Transfer money from your wallet to another user.
 */

module.exports = {
  config: {
    name: "transfer",
    aliases: ["give", "pay", "send"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Transfer money to another user",
    category: "economy",
    guide: "{pn} @mention [amount]\n{pn} [userID] [amount]",
  },

  onStart: async function ({ message, args, event, usersData }) {
    const mentions  = Object.keys(event.mentions || {});
    const targetID  = mentions[0] || args[0];
    const amountArg = mentions.length ? args[0] : args[1];

    if (!targetID || !amountArg) {
      return message.reply(
        "❌ Usage: /transfer @mention [amount]\n" +
        "Example: /transfer @John 500"
      );
    }

    if (String(targetID) === String(event.senderID)) {
      return message.reply("❌ You can't transfer money to yourself.");
    }

    const amount = parseInt(amountArg);
    if (isNaN(amount) || amount <= 0) {
      return message.reply("❌ Invalid amount. Must be a positive number.");
    }

    const sender   = await usersData.get(event.senderID);
    const receiver = await usersData.get(targetID);

    const senderWallet = sender?.money || 0;
    if (amount > senderWallet) {
      return message.reply(`❌ Insufficient funds.\nYou only have $${senderWallet.toLocaleString()} in your wallet.`);
    }

    await usersData.set(event.senderID, { money: senderWallet - amount });
    await usersData.set(targetID, { money: (receiver?.money || 0) + amount });

    return message.reply(
      `💸 𝗧𝗥𝗔𝗡𝗦𝗙𝗘𝗥 𝗦𝗨𝗖𝗖𝗘𝗦𝗦𝗙𝗨𝗟\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `📤 From    : ${event.senderID}\n` +
      `📥 To      : ${targetID}\n` +
      `💰 Amount  : $${amount.toLocaleString()}\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `💵 Your new balance: $${(senderWallet - amount).toLocaleString()}`
    );
  },
};
