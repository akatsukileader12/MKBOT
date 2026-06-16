/**
 * MKBOT Command: thread
 * @author Charles MK
 * Get detailed information about the current thread.
 */

module.exports = {
  config: {
    name: "thread",
    aliases: ["groupinfo2", "chatinfo", "threadinfo"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Get detailed info about this chat/group",
    category: "group",
    guide: "{pn} — view thread info",
  },
  onStart: async function ({ message, event, api }) {
    try {
      const info = await api.getThreadInfo(event.threadID);
      const memberCount = (info.participantIDs || []).length;
      const adminCount  = (info.adminIDs || []).length;
      const name        = info.name || "Direct Message";
      const isGroup     = event.isGroup;
      const isApproval  = info.approvalMode ? "🔒 On" : "🔓 Off";

      return message.reply(
        `💬 𝗧𝗛𝗥𝗘𝗔𝗗 𝗜𝗡𝗙𝗢\n━━━━━━━━━━━━━━━━━━\n` +
        `📛 Name      : ${name}\n` +
        `🆔 Thread ID : ${event.threadID}\n` +
        `📋 Type      : ${isGroup ? "Group Chat" : "Direct Message"}\n` +
        `👥 Members   : ${memberCount}\n` +
        `👑 Admins    : ${adminCount}\n` +
        `🔒 Approval  : ${isApproval}\n` +
        `━━━━━━━━━━━━━━━━━━\n🤖 MKBOT by Charles MK`
      );
    } catch (err) {
      return message.reply(`❌ Could not fetch thread info: ${err.message}`);
    }
  },
};
