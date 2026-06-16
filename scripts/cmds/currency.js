/**
 * MKBOT Command: currency
 * @author Charles MK
 * Convert between currencies using exchangerate-api (free endpoint).
 */

const axios = require("axios");

module.exports = {
  config: {
    name: "currency",
    aliases: ["convert", "exchange", "rate"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Convert between currencies",
    category: "utility",
    guide: "{pn} [amount] [from] [to]\nExample: {pn} 100 USD ZAR",
  },

  onStart: async function ({ message, args }) {
    if (args.length < 3) {
      return message.reply(
        "❌ Usage: /currency [amount] [from] [to]\n" +
        "Example: /currency 100 USD ZAR\n" +
        "Example: /currency 50 EUR GBP"
      );
    }

    const amount = parseFloat(args[0]);
    const from   = args[1].toUpperCase();
    const to     = args[2].toUpperCase();

    if (isNaN(amount) || amount <= 0) {
      return message.reply("❌ Invalid amount. Please provide a positive number.");
    }

    try {
      const { data } = await axios.get(
        `https://open.er-api.com/v6/latest/${from}`,
        { timeout: 8000 }
      );

      if (data.result !== "success") {
        return message.reply(`❌ Unknown currency: "${from}". Check your currency code.`);
      }

      const rate = data.rates[to];
      if (!rate) {
        return message.reply(`❌ Unknown target currency: "${to}". Check your currency code.`);
      }

      const result = (amount * rate).toFixed(2);

      return message.reply(
        `💱 𝗖𝗨𝗥𝗥𝗘𝗡𝗖𝗬 𝗖𝗢𝗡𝗩𝗘𝗥𝗧𝗘𝗥\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `💰 ${amount.toLocaleString()} ${from}\n` +
        `     =\n` +
        `💵 ${parseFloat(result).toLocaleString()} ${to}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `📈 Rate: 1 ${from} = ${rate.toFixed(4)} ${to}\n` +
        `🕐 ${new Date(data.time_last_update_utc).toDateString()}\n` +
        `🤖 MKBOT by Charles MK`
      );
    } catch (err) {
      return message.reply("❌ Currency conversion failed. Try again later.");
    }
  },
};
