/**
 * MKBOT Command: stop
 * @author Charles MK
 * Shuts the bot down. Dev only.
 */

module.exports = {
  config: {
    name: "stop",
    aliases: ["shutdown", "off"],
    version: "1.0",
    author: "Charles MK",
    role: 3,
    shortDescription: "Shut down the bot (dev only)",
    category: "owner",
    guide: "{pn}",
  },

  onStart: async function ({ message }) {
    await message.reply("🛑 MKBOT is shutting down. Goodbye!");
    setTimeout(() => process.exit(0), 1500);
  },
};
