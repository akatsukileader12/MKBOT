/**
 * MKBOT Command: prefix
 * @author Charles MK
 * View or set the per-thread prefix. Responds to bare "prefix" via onChat.
 */

module.exports = {
  config: {
    name: "prefix",
    aliases: ["setprefix"],
    version: "1.1",
    author: "Charles MK",
    role: 0,
    shortDescription: "View or set the bot prefix for this chat",
    category: "config",
    guide: "{pn} — view current prefix\n{pn} [new prefix] — set new prefix (admin only)",
  },

  onStart: async function ({ message, args, prefix, event, threadsData, role }) {
    if (!args[0]) {
      return message.reply(
        `╔══『 𝐏𝐑𝐄𝐅𝐈𝐗 』══╗\n` +
        `║ 💬 This Chat : ${prefix}\n` +
        `║ ➤ ${prefix}help to see all commands\n` +
        `╚═══════════════╝`
      );
    }

    // Only admins and above can set the prefix
    if (role < 2) {
      return message.reply("⛔ Only bot admins can change the prefix.");
    }

    const newPrefix = args[0].trim();
    if (newPrefix.length > 5) {
      return message.reply("❌ Prefix must be 5 characters or less.");
    }

    await threadsData.set(event.threadID, { prefix: newPrefix });
    return message.reply(
      `╔══『 𝐏𝐑𝐄𝐅𝐈𝐗 𝐔𝐏𝐃𝐀𝐓𝐄𝐃 』══╗\n` +
      `║ ✅ New prefix: "${newPrefix}"\n` +
      `║ ➤ ${newPrefix}help to see all commands\n` +
      `╚═══════════════════╝`
    );
  },

  onChat: async function ({ event, message, prefix }) {
    if (event.body && event.body.toLowerCase() === "prefix") {
      return message.reply(
        `╔══『 𝐏𝐑𝐄𝐅𝐈𝐗 』══╗\n` +
        `║ 💬 This Chat : ${prefix}\n` +
        `║ ➤ ${prefix}help to see all cmds\n` +
        `╚═══════════════╝`
      );
    }
  },
};
