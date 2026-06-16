/**
 * MKBOT Command: groupinfo
 * @author Charles MK
 */

module.exports = {
  config: {
    name: "groupinfo",
    aliases: ["gcinfo", "threadinfo"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Show information about this group",
    category: "info",
    guide: "{pn}",
  },

  onStart: async function ({ message, event, api }) {
    try {
      const threadInfo = await api.getThreadInfo(event.threadID);
      const memberCount = threadInfo.participantIDs?.length || 0;
      const adminIDs    = threadInfo.adminIDs?.map(a => a.uid) || [];
      const admins      = adminIDs.slice(0, 5).join(", ") || "None";

      message.reply(
        `ℹ️ 𝗚𝗥𝗢𝗨𝗣 𝗜𝗡𝗙𝗢\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `📌 Name      : ${threadInfo.threadName || "Unnamed"}\n` +
        `🆔 Thread ID : ${event.threadID}\n` +
        `👥 Members   : ${memberCount}\n` +
        `🛡️ Admins    : ${admins}${adminIDs.length > 5 ? ` (+${adminIDs.length - 5} more)` : ""}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `🤖 MKBOT by Charles MK`
      );
    } catch (err) {
      message.reply(`❌ Could not get group info: ${err.message}`);
    }
  },
};
