/**
 * MKBOT Command: ship
 * @author Charles MK
 * Ship two mentioned users together.
 */

module.exports = {
  config: {
    name: "ship",
    aliases: ["couple"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Ship two users together",
    category: "fun",
    guide: "{pn} @person1 @person2",
  },

  onStart: async function ({ message, args, event, usersData }) {
    const mentions = Object.keys(event.mentions || {});

    let name1, name2;

    if (mentions.length >= 2) {
      const u1 = await usersData.get(mentions[0]).catch(() => null);
      const u2 = await usersData.get(mentions[1]).catch(() => null);
      name1 = u1?.name || "Person 1";
      name2 = u2?.name || "Person 2";
    } else if (mentions.length === 1) {
      const u1 = await usersData.get(event.senderID).catch(() => null);
      const u2 = await usersData.get(mentions[0]).catch(() => null);
      name1 = u1?.name || "You";
      name2 = u2?.name || "Them";
    } else {
      return message.reply("❌ @mention two people to ship!\nExample: /ship @Person1 @Person2");
    }

    // Create ship name: first half of name1 + second half of name2
    const half1 = name1.slice(0, Math.ceil(name1.length / 2));
    const half2 = name2.slice(Math.floor(name2.length / 2));
    const shipName = half1 + half2;

    const combined = [name1, name2].sort().join("").toLowerCase();
    let hash = 0;
    for (const c of combined) hash = (hash * 31 + c.charCodeAt(0)) % 101;
    const pct = Math.max(10, hash);

    const emoji = pct >= 80 ? "💞" : pct >= 60 ? "💕" : pct >= 40 ? "💛" : "🤍";

    return message.reply(
      `${emoji} 𝗦𝗛𝗜𝗣𝗣𝗜𝗡𝗚\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `👤 ${name1}\n` +
      `        +\n` +
      `👤 ${name2}\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `🚢 Ship name: "${shipName}"\n` +
      `💯 Compatibility: ${pct}%\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `${emoji} MKBOT by Charles MK`
    );
  },
};
