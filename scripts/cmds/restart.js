/**
 * MKBOT Command: restart
 * @author Charles MK
 * Restarts the bot. Developer only.
 */

module.exports = {
  config: {
    name: "restart",
    aliases: ["reboot", "rs"],
    version: "1.0",
    author: "Charles MK",
    role: 2,
    shortDescription: "Restart the bot",
    category: "owner",
    guide: "{pn}",
  },

  onStart: async function ({ message }) {
    await message.reply("🔄 Restarting MKBOT... Please wait.");
    setTimeout(() => process.exit(2), 1500); // exit code 2 triggers auto-restart in index.js
  },
};
