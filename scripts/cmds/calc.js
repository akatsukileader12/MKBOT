/**
 * MKBOT Command: calc
 * @author Charles MK
 */

module.exports = {
  config: {
    name: "calc",
    aliases: ["calculate", "math"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Evaluate a math expression",
    category: "tools",
    guide: "{pn} [expression]\nExample: {pn} 5 * (3 + 2)",
  },

  onStart: async function ({ message, args }) {
    if (!args.length) {
      return message.reply("❌ Please provide a math expression.\nExample: /calc 5 * (3 + 2)");
    }

    const expr = args.join(" ");
    // Only allow safe math characters
    if (/[^0-9+\-*/.^%()\s]/.test(expr)) {
      return message.reply("❌ Invalid expression. Only numbers and basic operators are allowed.");
    }

    try {
      // eslint-disable-next-line no-new-func
      const result = Function(`"use strict"; return (${expr})`)();
      if (!isFinite(result)) {
        return message.reply("❌ Result is not a finite number.");
      }
      message.reply(
        `🧮 𝗖𝗔𝗟𝗖𝗨𝗟𝗔𝗧𝗢𝗥\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `📝 Expression: ${expr}\n` +
        `✅ Result    : ${result}`
      );
    } catch {
      message.reply("❌ Invalid expression. Please check your input.");
    }
  },
};
