/**
 * MKBOT Command: leaderboard
 * @author Charles MK
 * Show the top richest users by wallet + bank balance.
 */

module.exports = {
  config: {
    name: "leaderboard",
    aliases: ["lb", "top", "richlist"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Show top 10 richest users",
    category: "economy",
    guide: "{pn} — top 10 richest users\n{pn} [number] — top N users (max 20)",
  },

  onStart: async function ({ message, args, usersData }) {
    const limit = Math.min(parseInt(args[0]) || 10, 20);

    const allUsers = await usersData.getAll();
    if (!allUsers.length) {
      return message.reply("ℹ️ No users in the database yet.");
    }

    const sorted = allUsers
      .map(u => ({
        id:    u.userID,
        name:  u.name || u.userID,
        total: (u.money || 0) + (u.bankMoney || 0),
      }))
      .filter(u => u.total > 0)
      .sort((a, b) => b.total - a.total)
      .slice(0, limit);

    if (!sorted.length) {
      return message.reply("ℹ️ Nobody has any money yet. Use /daily to get started!");
    }

    const medals = ["🥇","🥈","🥉"];
    const lines  = sorted.map((u, i) => {
      const rank = medals[i] || `${i + 1}.`;
      return `${rank} ${u.name}\n    💰 $${u.total.toLocaleString()}`;
    });

    return message.reply(
      `🏆 𝗟𝗘𝗔𝗗𝗘𝗥𝗕𝗢𝗔𝗥𝗗 𝗧𝗢𝗣 ${sorted.length}\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      lines.join("\n") +
      `\n━━━━━━━━━━━━━━━━━━\n` +
      `🤖 MKBOT by Charles MK`
    );
  },
};
