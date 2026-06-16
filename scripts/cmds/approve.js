/**
 * MKBOT Command: approve
 * @author Charles MK
 * Approve/deny pending join requests for the group.
 */

module.exports = {
  config: {
    name: "approve",
    aliases: ["accept", "deny"],
    version: "1.0",
    author: "Charles MK",
    role: 1,
    shortDescription: "Approve or deny pending group join requests",
    category: "group",
    guide: "{pn} all — approve all pending\n{pn} @mention — approve specific user\n{pn} deny @mention — deny a user",
  },

  onStart: async function ({ message, args, event, api }) {
    if (!event.isGroup) {
      return message.reply("❌ This command only works in groups.");
    }

    const sub      = (args[0] || "").toLowerCase();
    const mentions = Object.keys(event.mentions || {});

    if (sub === "deny" && mentions.length > 0) {
      for (const uid of mentions) {
        try { await api.removeUserFromGroup(uid, event.threadID); } catch {}
      }
      return message.reply(`⛔ Denied ${mentions.length} join request(s).`);
    }

    if (sub === "all") {
      try {
        const info    = await api.getThreadInfo(event.threadID);
        const pending = info?.approvalQueue || [];

        if (!pending.length) {
          return message.reply("ℹ️ No pending join requests.");
        }

        let approved = 0;
        for (const req of pending) {
          try {
            await api.handleMessageRequest(req.inviterID || req.id, true);
            approved++;
          } catch {}
        }

        return message.reply(`✅ Approved ${approved}/${pending.length} join request(s).`);
      } catch (err) {
        return message.reply(`❌ Error: ${err.message}\n(This feature requires specific group permissions.)`);
      }
    }

    if (mentions.length > 0) {
      let approved = 0;
      for (const uid of mentions) {
        try {
          await api.handleMessageRequest(uid, true);
          approved++;
        } catch {}
      }
      return message.reply(`✅ Approved ${approved} user(s).`);
    }

    return message.reply(
      `📋 𝗔𝗣𝗣𝗥𝗢𝗩𝗔𝗟 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `/approve all         — approve all pending\n` +
      `/approve @mention    — approve specific user\n` +
      `/approve deny @user  — deny a user`
    );
  },
};
