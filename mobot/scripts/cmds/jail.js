/**
 * MKBOT Command: jail
 * @author Charles MK
 * Jail a user — temporarily restrict bot access with a timed release.
 */

module.exports = {
  config: {
    name: "jail",
    aliases: ["unjail", "prison"],
    version: "1.0",
    author: "Charles MK",
    role: 1,
    shortDescription: "Jail a user for a specified time (restricts bot access)",
    category: "admin",
    guide: "{pn} @mention [minutes] — jail for N minutes\n{pn} unjail @mention — release early",
  },

  onStart: async function ({ message, args, event, usersData, api }) {
    const sub      = (args[0] || "").toLowerCase();
    const mentions = Object.keys(event.mentions || {});

    if (sub === "unjail" || sub === "release" || sub === "free") {
      const targetID = mentions[0] || args[1];
      if (!targetID) return message.reply("❌ @mention someone to unjail.");
      await usersData.set(targetID, { jailed: false, jailExpiry: 0 });
      return message.reply(`✅ ${targetID} has been released from jail!`);
    }

    const targetID = mentions[0] || args[0];
    if (!targetID) return message.reply("❌ @mention someone to jail.");

    if (global.utils.isAdmin(targetID) || global.utils.isDev(targetID)) {
      return message.reply("⛔ You cannot jail an admin or developer.");
    }

    const minutesArg = mentions.length ? args[0] : args[1];
    const minutes    = parseInt(minutesArg) || 30;
    const expiry     = Date.now() + minutes * 60 * 1000;

    await usersData.set(targetID, { jailed: true, jailExpiry: expiry });

    // Schedule auto-release
    setTimeout(async () => {
      try {
        const u = await usersData.get(targetID);
        if (u?.jailed && (u?.jailExpiry || 0) <= Date.now()) {
          await usersData.set(targetID, { jailed: false, jailExpiry: 0 });
          await api.sendMessage(`🔓 ${targetID} has been released from jail!`, event.threadID);
        }
      } catch {}
    }, minutes * 60 * 1000);

    return message.reply(
      `⛓️ 𝗨𝗦𝗘𝗥 𝗝𝗔𝗜𝗟𝗘𝗗\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `👤 User     : ${targetID}\n` +
      `⏰ Duration : ${minutes} minute(s)\n` +
      `🔓 Released : ${new Date(expiry).toLocaleTimeString()}\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `They cannot use bot commands until then.`
    );
  },
};
