/**
 * MKBOT Command: antiout
 * @author Charles MK
 * Prevents members from leaving or kicks bots that join.
 */

module.exports = {
  config: {
    name: "antiout",
    aliases: ["antiLeave"],
    version: "1.0",
    author: "Charles MK",
    role: 1,
    shortDescription: "Toggle anti-leave protection for this group",
    category: "group",
    guide: "{pn} on|off",
  },

  onStart: async function ({ message, args, event, threadsData }) {
    const toggle = (args[0] || "").toLowerCase();
    if (!["on", "off"].includes(toggle)) {
      return message.reply("❌ Usage: /antiout on|off");
    }

    const enable = toggle === "on";
    await threadsData.set(event.threadID, { "settings.antiOut": enable });

    message.reply(
      `🛡️ Anti-Leave is now ${enable ? "✅ ON" : "❌ OFF"} for this group.`
    );
  },
};
