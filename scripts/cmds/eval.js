/**
 * MKBOT Command: eval
 * @author Charles MK
 * Evaluate JavaScript code. Dev only.
 */

module.exports = {
  config: {
    name: "eval",
    aliases: ["ev", "js"],
    version: "1.0",
    author: "Charles MK",
    role: 3,
    shortDescription: "Evaluate JavaScript code (dev only)",
    category: "system",
    guide: "{pn} [code]",
  },

  onStart: async function ({ message, args, event, api, usersData, threadsData, globalData }) {
    const code = args.join(" ");
    if (!code) return message.reply("❌ Provide code to evaluate.");

    const start = Date.now();
    try {
      let result = eval(code);
      if (result instanceof Promise) result = await result;

      const type = typeof result;
      const output = type === "object"
        ? JSON.stringify(result, null, 2)
        : String(result);

      return message.reply(
        `✅ 𝗘𝗩𝗔𝗟 𝗥𝗘𝗦𝗨𝗟𝗧\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `📤 Output:\n${output.slice(0, 1500)}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `⏱️ ${Date.now() - start}ms | Type: ${type}`
      );
    } catch (err) {
      return message.reply(
        `❌ 𝗘𝗩𝗔𝗟 𝗘𝗥𝗥𝗢𝗥\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `${err.message}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `⏱️ ${Date.now() - start}ms`
      );
    }
  },
};
