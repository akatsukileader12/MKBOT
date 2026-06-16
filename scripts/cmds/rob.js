/**
 * MKBOT Command: rob
 * @author Charles MK
 * Attempt to rob another user (50/50 chance).
 */

const COOLDOWN = 5 * 60 * 1000; // 5 minutes

module.exports = {
  config: {
    name: "rob",
    aliases: ["steal", "heist"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Try to rob another user (50/50 risk)",
    category: "economy",
    guide: "{pn} @mention — attempt to rob a user",
  },

  onStart: async function ({ message, args, event, usersData }) {
    const mentions  = Object.keys(event.mentions || {});
    const targetID  = mentions[0] || args[0];

    if (!targetID) {
      return message.reply("❌ @mention someone to rob!");
    }
    if (String(targetID) === String(event.senderID)) {
      return message.reply("❌ You can't rob yourself!");
    }

    const robber = await usersData.get(event.senderID);
    const victim = await usersData.get(targetID);

    // Cooldown check
    const lastRob = robber?.lastRob || 0;
    if (Date.now() - lastRob < COOLDOWN) {
      const remaining = Math.ceil((COOLDOWN - (Date.now() - lastRob)) / 60000);
      return message.reply(`⏳ You can rob again in ${remaining} minute(s).`);
    }

    const victimMoney = victim?.money || 0;
    if (victimMoney < 100) {
      return message.reply(`😅 ${targetID} is broke — not worth robbing!`);
    }

    const robberMoney = robber?.money || 0;
    const success     = Math.random() > 0.5;
    await usersData.set(event.senderID, { lastRob: Date.now() });

    if (success) {
      const stolen = Math.floor(victimMoney * (0.1 + Math.random() * 0.2)); // 10-30%
      await usersData.set(event.senderID, { money: robberMoney + stolen });
      await usersData.set(targetID, { money: victimMoney - stolen });

      return message.reply(
        `💰 𝗥𝗢𝗕𝗕𝗘𝗥𝗬 𝗦𝗨𝗖𝗖𝗘𝗦𝗦!\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `🦹 You stole $${stolen.toLocaleString()} from ${targetID}!\n` +
        `💵 Your balance: $${(robberMoney + stolen).toLocaleString()}`
      );
    } else {
      const fine = Math.min(Math.floor(robberMoney * 0.15), 500);
      await usersData.set(event.senderID, { money: Math.max(0, robberMoney - fine) });

      return message.reply(
        `🚔 𝗥𝗢𝗕𝗕𝗘𝗥𝗬 𝗙𝗔𝗜𝗟𝗘𝗗!\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `👮 You got caught and fined $${fine.toLocaleString()}!\n` +
        `💵 Your balance: $${Math.max(0, robberMoney - fine).toLocaleString()}`
      );
    }
  },
};
