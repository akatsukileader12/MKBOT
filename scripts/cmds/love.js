/**
 * MKBOT Command: love
 * @author Charles MK
 * Calculate "love percentage" between two users.
 */

module.exports = {
  config: {
    name: "love",
    aliases: ["lovemeter", "lovecalc"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Calculate love percentage between two names",
    category: "fun",
    guide: "{pn} [name1] + [name2]\nOr: {pn} @mention",
  },

  onStart: async function ({ message, args, event, usersData }) {
    let name1, name2;

    const mentions = Object.keys(event.mentions || {});

    if (mentions.length >= 2) {
      const u1 = await usersData.get(mentions[0]).catch(() => null);
      const u2 = await usersData.get(mentions[1]).catch(() => null);
      name1 = u1?.name || mentions[0];
      name2 = u2?.name || mentions[1];
    } else if (mentions.length === 1) {
      const u1 = await usersData.get(event.senderID).catch(() => null);
      const u2 = await usersData.get(mentions[0]).catch(() => null);
      name1 = u1?.name || "You";
      name2 = u2?.name || mentions[0];
    } else {
      const joined = args.join(" ");
      const parts  = joined.split(/\s*\+\s*|\s+and\s+/i);
      if (parts.length < 2) {
        return message.reply(
          "❌ Usage: /love [name1] + [name2]\n" +
          "Or @mention two people."
        );
      }
      name1 = parts[0].trim();
      name2 = parts[1].trim();
    }

    if (!name1 || !name2) {
      return message.reply("❌ Please provide two names.");
    }

    // Deterministic percentage based on combined names (same pair = same result)
    const combined = [name1, name2].sort().join("").toLowerCase();
    let hash = 0;
    for (const c of combined) hash = (hash * 31 + c.charCodeAt(0)) % 100;
    const pct = Math.max(5, hash);

    const bars = Math.round(pct / 10);
    const bar  = "❤️".repeat(bars) + "🖤".repeat(10 - bars);

    const msg = pct >= 90 ? "💑 Perfect match! Made for each other!" :
                pct >= 70 ? "😍 Great chemistry!" :
                pct >= 50 ? "🙂 Pretty good match!" :
                pct >= 30 ? "😐 Meh... could be better." :
                            "💔 Doesn't look good...";

    return message.reply(
      `💘 𝗟𝗢𝗩𝗘 𝗠𝗘𝗧𝗘𝗥\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `💕 ${name1}\n` +
      `    ❤️ loves\n` +
      `💕 ${name2}\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `${bar}\n` +
      `💯 ${pct}%\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `${msg}`
    );
  },
};
