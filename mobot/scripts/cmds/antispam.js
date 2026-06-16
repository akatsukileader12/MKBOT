/**
 * MKBOT Command: antispam
 * @author Charles MK
 * Enable/disable spam detection (same message repeated 3+ times quickly).
 */

const spamTracker = new Map(); // userID → [timestamps]

module.exports = {
  config: {
    name: "antispam",
    aliases: ["nospam", "antiflood"],
    version: "1.0",
    author: "Charles MK",
    role: 2,
    shortDescription: "Enable/disable anti-spam protection",
    category: "admin",
    guide: "{pn} on/off — toggle anti-spam\n{pn} status — check status",
  },

  onStart: async function ({ message, args, event, threadsData }) {
    const sub    = (args[0] || "").toLowerCase();
    const thread = await threadsData.get(event.threadID);
    if (sub === "on")  { await threadsData.set(event.threadID, { antiSpam: true });  return message.reply("✅ Anti-spam enabled!\nUsers spamming 5+ messages in 5s will be warned."); }
    if (sub === "off") { await threadsData.set(event.threadID, { antiSpam: false }); return message.reply("✅ Anti-spam disabled."); }
    const status = thread?.antiSpam ? "🟢 ON" : "🔴 OFF";
    return message.reply(`🛡️ Anti-spam: ${status}\nUse /antispam on/off to toggle.`);
  },

  onChat: async function ({ event, message, api, threadsData, usersData }) {
    if (!event.isGroup || !event.body) return;
    if (global.utils.isAdmin(event.senderID) || global.utils.isDev(event.senderID)) return;
    const thread = await threadsData.get(event.threadID);
    if (!thread?.antiSpam) return;

    const key  = `${event.threadID}_${event.senderID}`;
    const now  = Date.now();
    const times = (spamTracker.get(key) || []).filter(t => now - t < 5000);
    times.push(now);
    spamTracker.set(key, times);

    if (times.length >= 5) {
      spamTracker.delete(key);
      const user  = await usersData.get(event.senderID);
      const warns = (user?.warns || 0) + 1;
      await usersData.set(event.senderID, { warns, warnReasons: [...(user?.warnReasons||[]), "Spamming"] });

      if (warns >= 3) {
        try { await api.removeUserFromGroup(event.senderID, event.threadID); }
        catch {}
        return message.reply(`⛔ ${event.senderID} was kicked for spamming! (3/3 warns)`);
      }
      return message.reply(`⚠️ ${event.senderID}, stop spamming! (${warns}/3 warns)`);
    }
  },
};
