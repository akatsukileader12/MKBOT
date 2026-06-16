/**
 * MKBOT Command: afk
 * @author Charles MK
 * Set yourself as AFK — bot will auto-reply when you're mentioned.
 */

module.exports = {
  config: {
    name: "afk",
    aliases: ["away", "brb"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Set AFK status with a message",
    category: "utility",
    guide: "{pn} [reason?] — go AFK\nSend any message to come back",
  },

  onStart: async function ({ message, args, event, usersData }) {
    const reason = args.join(" ") || "AFK";
    await usersData.set(event.senderID, { afk: true, afkReason: reason, afkSince: Date.now() });
    return message.reply(`💤 You're now AFK: "${reason}"\nSend any message to return.`);
  },

  onChat: async function ({ event, message, api, usersData }) {
    if (!event.body) return;

    // Check if sender is AFK and is now back
    const user = await usersData.get(event.senderID);
    if (user?.afk) {
      const duration = Math.floor((Date.now() - (user.afkSince || Date.now())) / 60000);
      await usersData.set(event.senderID, { afk: false, afkReason: "" });
      await api.sendMessage(
        `✅ Welcome back! You were AFK for ${duration} minute(s).\nReason: ${user.afkReason}`,
        event.threadID
      );
      return;
    }

    // Check if any mentioned users are AFK
    const mentions = Object.keys(event.mentions || {});
    for (const uid of mentions) {
      const target = await usersData.get(uid).catch(() => null);
      if (target?.afk) {
        const duration = Math.floor((Date.now() - (target.afkSince || Date.now())) / 60000);
        await api.sendMessage(
          `💤 ${uid} is AFK (${duration}m): "${target.afkReason}"`,
          event.threadID
        );
      }
    }
  },
};
