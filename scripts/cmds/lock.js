/**
 * MKBOT Command: lock
 * @author Charles MK
 * Lock the group (only admins can chat) or unlock it.
 * Uses onChat to block non-admins when locked.
 */

module.exports = {
  config: {
    name: "lock",
    aliases: ["lockgroup", "unlock"],
    version: "1.0",
    author: "Charles MK",
    role: 2,
    shortDescription: "Lock/unlock the group (admin-chat only)",
    category: "admin",
    guide: "{pn} — toggle lock on/off\n{pn} on/off — explicit control",
  },

  onStart: async function ({ message, args, event, threadsData }) {
    if (!event.isGroup) {
      return message.reply("❌ This command only works in groups.");
    }

    const sub    = (args[0] || "").toLowerCase();
    const thread = await threadsData.get(event.threadID);
    let   locked = thread?.locked || false;

    if (sub === "on" || sub === "enable")  locked = true;
    else if (sub === "off" || sub === "disable") locked = false;
    else locked = !locked; // toggle

    await threadsData.set(event.threadID, { locked });

    return message.reply(
      locked
        ? `🔒 𝗚𝗥𝗢𝗨𝗣 𝗟𝗢𝗖𝗞𝗘𝗗\n━━━━━━━━━━━━━━━━━━\n` +
          `Only admins can send messages.\n` +
          `Use /lock off to unlock.`
        : `🔓 𝗚𝗥𝗢𝗨𝗣 𝗨𝗡𝗟𝗢𝗖𝗞𝗘𝗗\n━━━━━━━━━━━━━━━━━━\n` +
          `Everyone can send messages again.`
    );
  },

  onChat: async function ({ event, message, api, threadsData }) {
    if (!event.isGroup) return;
    if (!event.body) return;

    const senderID = event.senderID;
    if (global.utils.isAdmin(senderID) || global.utils.isDev(senderID)) return;
    if (String(senderID) === String(global.GoatBot.botID)) return;

    const thread = await threadsData.get(event.threadID);
    if (!thread?.locked) return;

    // Check if sender is a group admin
    try {
      const info = await api.getThreadInfo(event.threadID);
      const adminIDs = (info.adminIDs || []).map(a => String(a.id || a));
      if (adminIDs.includes(String(senderID))) return;
    } catch {}

    // Delete the message and warn
    try {
      await api.unsendMessage(event.messageID);
    } catch {}

    return message.reply(
      `🔒 This group is locked!\n` +
      `Only admins can send messages.`
    );
  },
};
