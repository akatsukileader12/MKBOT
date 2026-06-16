/**
 * MKBOT Command: dice
 * @author Charles MK
 * Roll dice — supports NdN format and betting.
 */

module.exports = {
  config: {
    name: "dice",
    aliases: ["roll2", "rolldice"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Roll dice (supports NdN format)",
    category: "fun",
    guide: "{pn} — roll 1d6\n{pn} 2d6 — roll two 6-sided dice\n{pn} 1d20 — roll a 20-sided die",
  },

  onStart: async function ({ message, args }) {
    const input = args[0] || "1d6";
    const match = input.match(/^(\d+)d(\d+)$/i);

    let count = 1, sides = 6;
    if (match) {
      count = Math.min(parseInt(match[1]), 10);
      sides = Math.min(parseInt(match[2]), 1000);
    } else if (!isNaN(parseInt(input))) {
      sides = Math.min(parseInt(input), 1000);
    }

    if (sides < 2) return message.reply("❌ Dice must have at least 2 sides.");

    const rolls = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
    const total = rolls.reduce((a, b) => a + b, 0);

    const dice_faces = { 6: ["⚀","⚁","⚂","⚃","⚄","⚅"] };
    const display = sides === 6
      ? rolls.map(r => dice_faces[6][r-1]).join(" ")
      : rolls.map(r => `[${r}]`).join(" ");

    return message.reply(
      `🎲 𝗗𝗜𝗖𝗘 𝗥𝗢𝗟𝗟\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `🎯 Rolling: ${count}d${sides}\n` +
      `${display}\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `${count > 1 ? `📊 Total: ${total}\n` : ""}` +
      `🤖 MKBOT by Charles MK`
    );
  },
};
