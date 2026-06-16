/**
 * MKBOT Command: countdowns
 * @author Charles MK
 * Days until a special date.
 */

const EVENTS = {
  christmas:   { name: "Christmas",     month: 12, day: 25 },
  newyear:     { name: "New Year",      month: 1,  day: 1  },
  halloween:   { name: "Halloween",     month: 10, day: 31 },
  valentines:  { name: "Valentine's Day", month: 2, day: 14 },
  easter:      { name: "Easter (approx)", month: 4, day: 1  },
  blackfriday: { name: "Black Friday",  month: 11, day: 29 },
};

module.exports = {
  config: {
    name: "countdowns",
    aliases: ["countdown2", "daysuntil", "daysleft"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Days until a special event",
    category: "utility",
    guide: "{pn} [event] — see available events\nExample: /countdowns christmas",
  },

  onStart: async function ({ message, args }) {
    const input = (args[0] || "").toLowerCase();
    const now   = new Date();

    if (!input) {
      const lines = Object.entries(EVENTS).map(([k, v]) => {
        const target = new Date(now.getFullYear(), v.month - 1, v.day);
        if (target < now) target.setFullYear(now.getFullYear() + 1);
        const days = Math.ceil((target - now) / 86400000);
        return `${v.name}: ${days} days`;
      });
      return message.reply(
        `📅 𝗘𝗩𝗘𝗡𝗧 𝗖𝗢𝗨𝗡𝗧𝗗𝗢𝗪𝗡𝗦\n━━━━━━━━━━━━━━━━━━\n${lines.join("\n")}`
      );
    }

    const event = EVENTS[input];
    if (!event) {
      return message.reply(
        `❌ Unknown event.\nAvailable: ${Object.keys(EVENTS).join(", ")}\n\nOr: /countdowns [DD/MM/YYYY] for custom date`
      );
    }

    const target = new Date(now.getFullYear(), event.month - 1, event.day);
    if (target < now) target.setFullYear(now.getFullYear() + 1);
    const days = Math.ceil((target - now) / 86400000);

    return message.reply(
      `📅 ${event.name}\n━━━━━━━━━━━━━━━━━━\n🗓️ ${days} day${days !== 1 ? "s" : ""} to go!\n📆 ${target.toDateString()}`
    );
  },
};
