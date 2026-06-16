/**
 * MKBOT Command: roulette
 * @author Charles MK
 * Roulette wheel — bet on red, black, green (0), or a number.
 */

module.exports = {
  config: {
    name: "roulette",
    aliases: ["wheel"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Play roulette (bet on red/black/green or a number)",
    category: "economy",
    guide: "{pn} [bet] [red/black/green/0-36]\nExample: {pn} 100 red\nExample: {pn} 50 17",
  },
  onStart: async function ({ message, args, event, usersData }) {
    const bet    = parseInt(args[0]);
    const choice = (args[1] || "").toLowerCase();
    if (!bet || bet < 10) return message.reply("❌ Minimum bet is 10.\nUsage: /roulette [amount] [red/black/green/number]");
    if (!choice) return message.reply("❌ Choose: red, black, green, or a number 0-36");
    const user   = await usersData.get(event.senderID);
    const wallet = user?.money || 0;
    if (bet > wallet) return message.reply(`❌ You only have $${wallet.toLocaleString()}.`);
    const spin = Math.floor(Math.random() * 37);
    const RED_NUMS   = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
    const BLACK_NUMS = [2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35];
    const spinColor  = spin === 0 ? "green" : RED_NUMS.includes(spin) ? "red" : "black";
    const spinEmoji  = spinColor === "green" ? "🟢" : spinColor === "red" ? "🔴" : "⚫";
    let win = false, mult = 1;
    if (choice === "green" || choice === "0") { win = spinColor === "green"; mult = 36; }
    else if (choice === "red")   { win = spinColor === "red";   mult = 2; }
    else if (choice === "black") { win = spinColor === "black"; mult = 2; }
    else {
      const num = parseInt(choice);
      if (!isNaN(num) && num >= 0 && num <= 36) { win = spin === num; mult = 36; }
      else return message.reply("❌ Invalid choice. Use red, black, green, or 0-36.");
    }
    const delta  = win ? bet * (mult - 1) : -bet;
    const newBal = Math.max(0, wallet + delta);
    await usersData.set(event.senderID, { money: newBal });
    return message.reply(
      `🎡 𝗥𝗢𝗨𝗟𝗘𝗧𝗧𝗘\n━━━━━━━━━━━━━━━━━━\n` +
      `${spinEmoji} Spin: ${spin} (${spinColor})\n💰 Bet: $${bet} on "${choice}"\n━━━━━━━━━━━━━━━━━━\n` +
      `${win ? `✅ WIN! +$${(bet*(mult-1)).toLocaleString()} (${mult}x)` : `❌ LOSE! -$${bet.toLocaleString()}`}\n` +
      `💵 Balance: $${newBal.toLocaleString()}`
    );
  },
};
