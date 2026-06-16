/**
 * MKBOT Command: goodbye
 * @author Charles MK
 * Configure goodbye messages for users who leave the group.
 */

module.exports = {
  config: {
    name: "goodbye",
    aliases: ["farewell", "setgoodbye"],
    version: "1.0",
    author: "Charles MK",
    role: 2,
    shortDescription: "Set/manage group goodbye messages",
    category: "group",
    guide: "{pn} on — enable\n{pn} off — disable\n{pn} set [msg] — custom message",
  },
  onStart: async function ({ message, args, event, threadsData }) {
    const sub    = (args[0] || "").toLowerCase();
    const thread = await threadsData.get(event.threadID);
    if (sub === "on")  { await threadsData.set(event.threadID, { goodbyeEnabled: true });  return message.reply("✅ Goodbye messages enabled!"); }
    if (sub === "off") { await threadsData.set(event.threadID, { goodbyeEnabled: false }); return message.reply("✅ Goodbye messages disabled."); }
    if (sub === "set") {
      const msg = args.slice(1).join(" ").trim();
      if (!msg) return message.reply("❌ Provide a message. Variables: {name}");
      await threadsData.set(event.threadID, { goodbyeMsg: msg, goodbyeEnabled: true });
      return message.reply(`✅ Goodbye message set!\n"${msg}"`);
    }
    const status = thread?.goodbyeEnabled ? "🟢 Enabled" : "🔴 Disabled";
    const msg    = thread?.goodbyeMsg || "Goodbye, {name}! We'll miss you. 👋 (default)";
    return message.reply(`👋 𝗚𝗢𝗢𝗗𝗕𝗬𝗘\nStatus: ${status}\nMessage: "${msg}"\n/goodbye on/off/set`);
  },

  onEvent: async function ({ event, api, threadsData, usersData }) {
    if (event.type !== "log:unsubscribe") return;
    const thread = await threadsData.get(event.threadID);
    if (!thread?.goodbyeEnabled) return;
    const leftIDs = event.logMessageData?.leftParticipantFbId ? [event.logMessageData.leftParticipantFbId] : [];
    for (const uid of leftIDs) {
      const u    = await usersData.get(uid).catch(() => null);
      const name = u?.name || uid;
      const msg  = (thread.goodbyeMsg || "Goodbye, {name}! We'll miss you. 👋").replace(/\{name\}/g, name);
      try { await api.sendMessage(`👋 ${msg}`, event.threadID); } catch {}
    }
  },
};
