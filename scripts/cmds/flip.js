/**
 * MKBOT Command: flip
 * @author Charles MK
 * Flip a coin or bet on it.
 */

module.exports = {
  config: {
    name: "flip",
    aliases: ["coinflip", "cf"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Flip a coin or bet on heads/tails",
    category: "economy",
    guide: "{pn} — flip a coin\n{pn} heads [bet] — bet on heads\n{pn} tails [bet] — bet on tails",
  },

  onStart: async function ({ message, args, event, usersData }) {
    const side    = (args[0] || "").toLowerCase();
    const bet     = parseInt(args[1]);
    const result  = Math.random() > 0.5 ? "heads" : "tails";
    const emoji   = result === "heads" ? "🪙 HEADS" : "🔘 TAILS";

    if (!["heads", "tails"].includes(side) || !bet) {
      return message.reply(
        `${emoji}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `🎲 The coin landed on: ${result.toUpperCase()}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `💡 Tip: /flip heads [amount] to bet!`
      );
    }

    if (bet < 10) return message.reply("❌ Minimum bet is 10.");

    const user   = await usersData.get(event.senderID);
    const wallet = user?.money || 0;
    if (bet > wallet) return message.reply(`❌ You only have $${wallet.toLocaleString()}.`);

    const won = side === result;
    const newBal = won ? wallet + bet : wallet - bet;
    await usersData.set(event.senderID, { money: Math.max(0, newBal) });

    return message.reply(
      `🪙 𝗖𝗢𝗜𝗡 𝗙𝗟𝗜𝗣\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `🎲 Result  : ${emoji}\n` +
      `💰 Your bet: ${side} ($${bet.toLocaleString()})\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `${won ? `✅ You WIN! +$${bet.toLocaleString()}` : `❌ You LOSE! -$${bet.toLocaleString()}`}\n` +
      `💵 Balance: $${Math.max(0, newBal).toLocaleString()}`
    );
  },
};
