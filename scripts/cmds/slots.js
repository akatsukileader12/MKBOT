/**
 * MKBOT Command: slots
 * @author Charles MK
 * Slot machine gambling.
 */

const SYMBOLS = ["🍒","🍋","🍊","🍇","💎","7️⃣","🎰","⭐","🔔","🍀"];
const PAYOUTS = {
  "💎💎💎": 50, "7️⃣7️⃣7️⃣": 20, "🎰🎰🎰": 15,
  "⭐⭐⭐": 10, "🍀🍀🍀": 8,  "🔔🔔🔔": 6,
  "🍒🍒🍒": 4,  "🍋🍋🍋": 3,  "🍊🍊🍊": 3, "🍇🍇🍇": 3,
};

function spin() {
  return [
    SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
    SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
    SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
  ];
}

module.exports = {
  config: {
    name: "slots",
    aliases: ["slot", "gamble"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Play the slot machine",
    category: "economy",
    guide: "{pn} [bet amount]\nExample: {pn} 100",
  },

  onStart: async function ({ message, args, event, usersData }) {
    const bet = parseInt(args[0]);
    if (!bet || bet < 10) {
      return message.reply("❌ Minimum bet is 10.\nUsage: /slots [amount]");
    }

    const user   = await usersData.get(event.senderID);
    const wallet = user?.money || 0;

    if (bet > wallet) {
      return message.reply(`❌ You only have $${wallet.toLocaleString()} in your wallet.`);
    }

    const reels  = spin();
    const combo  = reels.join("");
    const mult   = PAYOUTS[combo];
    const won    = mult ? Math.floor(bet * mult) : 0;
    const net    = won - bet;
    const newBal = wallet + net;

    await usersData.set(event.senderID, { money: newBal });

    const result = won > 0
      ? `🎉 JACKPOT! You win $${won.toLocaleString()}! (+$${net.toLocaleString()})`
      : `😔 No match. You lose $${bet.toLocaleString()}.`;

    return message.reply(
      `🎰 𝗦𝗟𝗢𝗧 𝗠𝗔𝗖𝗛𝗜𝗡𝗘\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `💰 Bet: $${bet.toLocaleString()}\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `| ${reels[0]} | ${reels[1]} | ${reels[2]} |\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `${result}\n` +
      `💵 Balance: $${newBal.toLocaleString()}`
    );
  },
};
