/**
 * MKBOT Command: remind
 * @author Charles MK
 * Set a reminder — bot will DM or reply in X minutes.
 */

module.exports = {
  config: {
    name: "remind",
    aliases: ["reminder", "remindme"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Set a reminder",
    category: "utility",
    guide: "{pn} [minutes] [message]\nExample: {pn} 30 Check the oven\nMax: 1440 minutes (24 hours)",
  },

  onStart: async function ({ message, args, event, api }) {
    if (args.length < 2) {
      return message.reply(
        "❌ Usage: /remind [minutes] [message]\n" +
        "Example: /remind 10 Take a break!\n" +
        "Max: 1440 minutes (24 hours)"
      );
    }

    const minutes = parseInt(args[0]);
    if (isNaN(minutes) || minutes < 1 || minutes > 1440) {
      return message.reply("❌ Minutes must be between 1 and 1440 (24 hours).");
    }

    const reminderText = args.slice(1).join(" ");
    const ms           = minutes * 60 * 1000;

    await message.reply(
      `⏰ 𝗥𝗘𝗠𝗜𝗡𝗗𝗘𝗥 𝗦𝗘𝗧\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `🕐 In: ${minutes} minute${minutes > 1 ? "s" : ""}\n` +
      `📝 Reminder: ${reminderText}\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `I'll remind you at ${new Date(Date.now() + ms).toLocaleTimeString()}!`
    );

    setTimeout(async () => {
      try {
        await api.sendMessage(
          `⏰ 𝗥𝗘𝗠𝗜𝗡𝗗𝗘𝗥\n` +
          `━━━━━━━━━━━━━━━━━━\n` +
          `📝 ${reminderText}\n` +
          `━━━━━━━━━━━━━━━━━━\n` +
          `🤖 MKBOT Reminder`,
          event.threadID
        );
      } catch {}
    }, ms);
  },
};
