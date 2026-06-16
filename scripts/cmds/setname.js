/**
 * MKBOT Command: setname
 * @author Charles MK
 * Set a display name in the bot's database.
 */

module.exports = {
  config: {
    name: "setname",
    aliases: ["nickname", "mynick"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Set your display name in MKBOT",
    category: "utility",
    guide: "{pn} [name] — set your display name",
  },
  onStart: async function ({ message, args, event, usersData }) {
    const name = args.join(" ").trim().slice(0, 50);
    if (!name) return message.reply("❌ Usage: /setname [your name]");
    await usersData.set(event.senderID, { name });
    return message.reply(`✅ Display name set to: "${name}"`);
  },
};
