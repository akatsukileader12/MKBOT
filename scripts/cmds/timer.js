/**
 * MKBOT Command: timer
 * @author Charles MK
 * Start a countdown timer.
 */

module.exports = {
  config: {
    name: "timer",
    aliases: ["countdown", "stopwatch"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Start a countdown timer",
    category: "utility",
    guide: "{pn} [seconds|minutes] [label?]\nExample: {pn} 60 Pomodoro break\nMax: 3600s (1 hour)",
  },

  onStart: async function ({ message, args, event, api }) {
    if (!args.length) {
      return message.reply("❌ Usage: /timer [seconds] [label?]\nExample: /timer 60 Pizza in the oven");
    }

    let seconds = parseInt(args[0]);
    if (isNaN(seconds) || seconds < 5 || seconds > 3600) {
      return message.reply("❌ Timer must be between 5 and 3600 seconds.");
    }

    const label = args.slice(1).join(" ") || "Timer";
    const endAt = new Date(Date.now() + seconds * 1000);

    await message.reply(
      `⏱️ 𝗧𝗜𝗠𝗘𝗥 𝗦𝗧𝗔𝗥𝗧𝗘𝗗\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `📝 ${label}\n` +
      `⏰ Duration: ${seconds}s\n` +
      `🏁 Ends at: ${endAt.toLocaleTimeString()}`
    );

    setTimeout(async () => {
      try {
        await api.sendMessage(
          `⏰ 𝗧𝗜𝗠𝗘𝗥 𝗗𝗢𝗡𝗘!\n` +
          `━━━━━━━━━━━━━━━━━━\n` +
          `📝 ${label}\n` +
          `✅ ${seconds} seconds are up!\n` +
          `🤖 MKBOT`,
          event.threadID
        );
      } catch {}
    }, seconds * 1000);
  },
};
