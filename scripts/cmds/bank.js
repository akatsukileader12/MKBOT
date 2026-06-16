/**
 * MKBOT Command: bank
 * @author Charles MK
 * Bank system — deposit, withdraw, check balance, transfer.
 */

const DAILY_INTEREST_RATE = 0.01; // 1% daily interest

module.exports = {
  config: {
    name: "bank",
    aliases: ["savings"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Bank system — deposit, withdraw, check balance",
    category: "economy",
    guide: [
      "{pn} balance — check bank balance",
      "{pn} deposit [amount] — deposit money",
      "{pn} withdraw [amount] — withdraw money",
      "{pn} interest — collect daily interest",
    ].join("\n"),
  },

  onStart: async function ({ message, args, event, usersData }) {
    const sub    = (args[0] || "balance").toLowerCase();
    const userID = event.senderID;
    const user   = await usersData.get(userID);

    const wallet = user?.money     || 0;
    const bank   = user?.bankMoney || 0;

    /* ── balance ─────────────────────────────────────────── */
    if (sub === "balance" || sub === "bal" || sub === "check") {
      return message.reply(
        `🏦 𝗕𝗔𝗡𝗞 𝗔𝗖𝗖𝗢𝗨𝗡𝗧\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `👤 User      : ${userID}\n` +
        `💵 Wallet    : $${wallet.toLocaleString()}\n` +
        `🏦 Bank      : $${bank.toLocaleString()}\n` +
        `💰 Net Worth : $${(wallet + bank).toLocaleString()}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `💡 Use /bank deposit/withdraw to manage funds.`
      );
    }

    /* ── deposit ─────────────────────────────────────────── */
    if (sub === "deposit" || sub === "dep") {
      const amount = parseInt(args[1]);
      if (!amount || amount <= 0) return message.reply("❌ Usage: /bank deposit [amount]");
      if (amount > wallet) return message.reply(`❌ You only have $${wallet} in your wallet.`);

      await usersData.set(userID, { money: wallet - amount, bankMoney: bank + amount });
      return message.reply(
        `✅ 𝗗𝗘𝗣𝗢𝗦𝗜𝗧 𝗦𝗨𝗖𝗖𝗘𝗦𝗦𝗙𝗨𝗟\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `➕ Deposited : $${amount.toLocaleString()}\n` +
        `🏦 Bank Bal  : $${(bank + amount).toLocaleString()}\n` +
        `💵 Wallet    : $${(wallet - amount).toLocaleString()}`
      );
    }

    /* ── withdraw ────────────────────────────────────────── */
    if (sub === "withdraw" || sub === "with" || sub === "wd") {
      const amount = parseInt(args[1]);
      if (!amount || amount <= 0) return message.reply("❌ Usage: /bank withdraw [amount]");
      if (amount > bank) return message.reply(`❌ You only have $${bank} in your bank.`);

      await usersData.set(userID, { money: wallet + amount, bankMoney: bank - amount });
      return message.reply(
        `✅ 𝗪𝗜𝗧𝗛𝗗𝗥𝗔𝗪𝗔𝗟 𝗦𝗨𝗖𝗖𝗘𝗦𝗦𝗙𝗨𝗟\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `➖ Withdrew  : $${amount.toLocaleString()}\n` +
        `🏦 Bank Bal  : $${(bank - amount).toLocaleString()}\n` +
        `💵 Wallet    : $${(wallet + amount).toLocaleString()}`
      );
    }

    /* ── interest ────────────────────────────────────────── */
    if (sub === "interest" || sub === "int") {
      const lastInterest = user?.lastInterest || 0;
      const now          = Date.now();
      const cooldown     = 24 * 60 * 60 * 1000; // 24h

      if (now - lastInterest < cooldown) {
        const remaining = cooldown - (now - lastInterest);
        const hrs = Math.floor(remaining / 3600000);
        const mins = Math.floor((remaining % 3600000) / 60000);
        return message.reply(
          `⏳ Interest is only available once per day.\n` +
          `Come back in ${hrs}h ${mins}m.`
        );
      }

      if (bank === 0) return message.reply("❌ You have no money in your bank to earn interest.");

      const earned = Math.floor(bank * DAILY_INTEREST_RATE);
      await usersData.set(userID, { bankMoney: bank + earned, lastInterest: now });

      return message.reply(
        `💰 𝗗𝗔𝗜𝗟𝗬 𝗜𝗡𝗧𝗘𝗥𝗘𝗦𝗧\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `📈 Rate    : 1% per day\n` +
        `💵 Earned  : $${earned.toLocaleString()}\n` +
        `🏦 New Bal : $${(bank + earned).toLocaleString()}`
      );
    }

    return message.reply(
      `🏦 𝗕𝗔𝗡𝗞 𝗠𝗘𝗡𝗨\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `/bank balance    — check balance\n` +
      `/bank deposit    — deposit money\n` +
      `/bank withdraw   — withdraw money\n` +
      `/bank interest   — collect daily 1% interest`
    );
  },
};
