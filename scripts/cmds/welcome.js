/**
 * MKBOT Command: welcome
 * @author Charles MK
 * Configure welcome messages for new group members.
 */

module.exports = {
  config: {
    name: "welcome",
    aliases: ["setwelcome", "welcomemsg"],
    version: "1.0",
    author: "Charles MK",
    role: 2,
    shortDescription: "Set/manage group welcome messages",
    category: "group",
    guide: "{pn} on — enable welcome\n{pn} off — disable\n{pn} set [msg] — set custom message\n{pn} test — preview",
  },
  onStart: async function ({ message, args, event, threadsData }) {
    const sub    = (args[0] || "").toLowerCase();
    const thread = await threadsData.get(event.threadID);

    if (sub === "on") {
      await threadsData.set(event.threadID, { welcomeEnabled: true });
      return message.reply("✅ Welcome messages enabled!");
    }
    if (sub === "off") {
      await threadsData.set(event.threadID, { welcomeEnabled: false });
      return message.reply("✅ Welcome messages disabled.");
    }
    if (sub === "set") {
      const msg = args.slice(1).join(" ").trim();
      if (!msg) return message.reply("❌ Provide a message.\nVariables: {name}, {threadName}");
      await threadsData.set(event.threadID, { welcomeMsg: msg, welcomeEnabled: true });
      return message.reply(`✅ Welcome message set!\n"${msg}"`);
    }
    if (sub === "test") {
      const msg  = thread?.welcomeMsg || "Welcome to the group, {name}! 🎉";
      const text = msg.replace(/\{name\}/g, "TestUser").replace(/\{threadName\}/g, "This Group");
      return message.reply(`🔔 Preview:\n${text}`);
    }

    const status = thread?.welcomeEnabled ? "🟢 Enabled" : "🔴 Disabled";
    const msg    = thread?.welcomeMsg || "Welcome to the group, {name}! 🎉 (default)";
    return message.reply(
      `🔔 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗦𝗘𝗧𝗧𝗜𝗡𝗚𝗦\n━━━━━━━━━━━━━━━━━━\n` +
      `Status: ${status}\n` +
      `Message: "${msg}"\n━━━━━━━━━━━━━━━━━━\n` +
      `/welcome on/off/set/test`
    );
  },

  onEvent: async function ({ event, api, threadsData, usersData }) {
    if (event.type !== "log:subscribe") return;
    const thread = await threadsData.get(event.threadID);
    if (!thread?.welcomeEnabled) return;

    const addedIDs = event.logMessageData?.addedParticipants?.map(p => p.userFbId) || [];
    if (!addedIDs.length) return;

    for (const uid of addedIDs) {
      const u    = await usersData.get(uid).catch(() => null);
      const name = u?.name || uid;
      const msg  = (thread.welcomeMsg || "Welcome to the group, {name}! 🎉")
        .replace(/\{name\}/g, name).replace(/\{threadName\}/g, thread.name || "the group");
      try {
        await api.sendMessage(`🔔 ${msg}`, event.threadID);
      } catch {}
    }
  },
};
