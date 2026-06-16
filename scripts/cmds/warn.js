/**
 * MKBOT Command: warn
 * @author Charles MK
 * Warn a user. Auto-kick at 3 warnings.
 */

module.exports = {
  config: {
    name: "warn",
    aliases: ["warning"],
    version: "1.0",
    author: "Charles MK",
    role: 1,
    shortDescription: "Warn a user (auto-kick at 3 warnings)",
    category: "admin",
    guide: "{pn} @mention [reason?]\n{pn} check @mention — view warnings\n{pn} reset @mention — reset warnings",
  },

  onStart: async function ({ message, args, event, api, usersData }) {
    const sub      = (args[0] || "").toLowerCase();
    const mentions = Object.keys(event.mentions || {});

    /* ── check ───────────────────────────────────────────── */
    if (sub === "check") {
      const targetID = mentions[0] || args[1];
      if (!targetID) return message.reply("❌ @mention someone to check.");
      const user  = await usersData.get(targetID);
      const count = user?.warns || 0;
      return message.reply(
        `⚠️ 𝗪𝗔𝗥𝗡𝗜𝗡𝗚𝗦\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `👤 User: ${targetID}\n` +
        `⚠️ Warns: ${count}/3\n` +
        `${count >= 3 ? "⛔ Should be kicked!" : "✅ Within limit"}`
      );
    }

    /* ── reset ───────────────────────────────────────────── */
    if (sub === "reset" || sub === "clear") {
      const targetID = mentions[0] || args[1];
      if (!targetID) return message.reply("❌ @mention someone to reset.");
      await usersData.set(targetID, { warns: 0, warnReasons: [] });
      return message.reply(`✅ Warnings reset for ${targetID}.`);
    }

    /* ── warn ────────────────────────────────────────────── */
    const targetID = mentions[0] || args[0];
    if (!targetID) return message.reply("❌ @mention someone to warn.");

    if (global.utils.isAdmin(targetID) || global.utils.isDev(targetID)) {
      return message.reply("⛔ You cannot warn an admin or developer.");
    }

    const reason = args.slice(mentions.length ? 1 : 1).join(" ") || "No reason provided";
    const user   = await usersData.get(targetID);
    const warns  = (user?.warns || 0) + 1;
    const warnReasons = [...(user?.warnReasons || []), reason];

    await usersData.set(targetID, { warns, warnReasons });

    let extra = "";
    if (warns >= 3) {
      extra = "\n⛔ 3 warnings reached!";
      if (event.isGroup) {
        try {
          await api.removeUserFromGroup(targetID, event.threadID);
          extra += "\n👢 User has been auto-kicked.";
        } catch {
          extra += "\n⚠️ Auto-kick failed — bot may not be admin.";
        }
      }
    }

    return message.reply(
      `⚠️ 𝗪𝗔𝗥𝗡𝗜𝗡𝗚\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `👤 User   : ${targetID}\n` +
      `📝 Reason : ${reason}\n` +
      `⚠️ Warns  : ${warns}/3\n` +
      `━━━━━━━━━━━━━━━━━━` +
      extra
    );
  },
};
