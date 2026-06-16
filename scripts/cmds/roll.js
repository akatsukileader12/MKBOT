/**
 * MKBOT Command: roll
 * @author Charles MK
 */

module.exports = {
  config: {
    name: "roll",
    aliases: ["dice", "rolldice"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Roll a dice",
    category: "fun",
    guide: "{pn} [sides?] — default is 6-sided",
  },

  onStart: async function ({ message, args }) {
    const sides = parseInt(args[0]) || 6;
    if (sides < 2 || sides > 1000) {
      return message.reply("❌ Please choose between 2 and 1000 sides.");
    }
    const result = global.utils.randomInt(1, sides);
    message.reply(`🎲 You rolled a ${sides}-sided dice and got: **${result}**`);
  },
};
