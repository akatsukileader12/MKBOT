/**
 * MKBOT Command: profile
 * @author Charles MK
 * Display a user's MKBOT profile card.
 */

module.exports = {
  config: {
    name: "profile",
    aliases: ["card", "myprofile", "p"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "View your or someone's MKBOT profile",
    category: "economy",
    guide: "{pn} — your profile\n{pn} @mention — view someone else's profile",
  },

  onStart: async function ({ message, args, event, usersData }) {
    const mentions  = Object.keys(event.mentions || {});
    const targetID  = mentions[0] || event.senderID;
    const user      = await usersData.get(targetID);

    const name    = user?.name    || targetID;
    const money   = user?.money   || 0;
    const bank    = user?.bankMoney || 0;
    const warns   = user?.warns   || 0;
    const banned  = user?.banned  ? "⛔ Yes" : "✅ No";
    const jailed  = user?.jailed  ? "⛓️ Yes" : "✅ No";
    const items   = (user?.inventory || []).length;

    // Role badge
    const isBotAdmin = global.GoatBot.config?.adminBot?.includes(String(targetID));
    const isDev      = String(targetID) === String(global.GoatBot.botID) || global.utils.isDev(targetID);
    const role       = isDev ? "👑 Developer" : isBotAdmin ? "🛡️ Admin" : "👤 User";

    // Net worth
    const netWorth = money + bank;
    const rankEmoji = netWorth >= 100000 ? "💎" : netWorth >= 10000 ? "🥇" : netWorth >= 1000 ? "🥈" : "🥉";

    return message.reply(
      `👤 𝗣𝗥𝗢𝗙𝗜𝗟𝗘\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `📛 Name      : ${name}\n` +
      `🆔 ID        : ${targetID}\n` +
      `🏅 Role      : ${role}\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `💵 Wallet    : $${money.toLocaleString()}\n` +
      `🏦 Bank      : $${bank.toLocaleString()}\n` +
      `${rankEmoji} Net Worth : $${netWorth.toLocaleString()}\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `⚠️ Warns     : ${warns}/3\n` +
      `🚫 Banned    : ${banned}\n` +
      `⛓️ Jailed    : ${jailed}\n` +
      `🎒 Items     : ${items}\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `🤖 MKBOT by Charles MK`
    );
  },
};
