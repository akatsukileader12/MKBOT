/**
 * MKBOT Command: adminonly
 * @author Charles MK
 * Restrict bot commands to admins only in this thread.
 */

module.exports = {
  config: {
    name: "adminonly",
    aliases: ["ao", "adminsonly"],
    version: "1.0",
    author: "Charles MK",
    role: 2,
    shortDescription: "Toggle admin-only bot commands for this thread",
    category: "admin",
    guide: "{pn} on/off — enable or disable admin-only mode\n{pn} — check status",
  },

  onStart: async function ({ message, args, event, threadsData }) {
    const sub    = (args[0] || "").toLowerCase();
    const thread = await threadsData.get(event.threadID);

    let enabled = thread?.adminOnly || false;

    if (sub === "on" || sub === "enable")   enabled = true;
    else if (sub === "off" || sub === "disable") enabled = false;
    else if (!sub) {
      return message.reply(
        `⚙️ 𝗔𝗗𝗠𝗜𝗡-𝗢𝗡𝗟𝗬 𝗠𝗢𝗗𝗘\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `Status: ${enabled ? "🔒 ON" : "🔓 OFF"}\n` +
        `Use /adminonly on/off to toggle.`
      );
    } else {
      enabled = !enabled;
    }

    await threadsData.set(event.threadID, { adminOnly: enabled });

    return message.reply(
      enabled
        ? `🔒 𝗔𝗗𝗠𝗜𝗡-𝗢𝗡𝗟𝗬 𝗘𝗡𝗔𝗕𝗟𝗘𝗗\n━━━━━━━━━━━━━━━━━━\n` +
          `Only admins can use bot commands here.\nUse /adminonly off to disable.`
        : `🔓 𝗔𝗗𝗠𝗜𝗡-𝗢𝗡𝗟𝗬 𝗗𝗜𝗦𝗔𝗕𝗟𝗘𝗗\n━━━━━━━━━━━━━━━━━━\n` +
          `All users can use bot commands again.`
    );
  },
};
