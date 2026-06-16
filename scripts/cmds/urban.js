/**
 * MKBOT Command: urban
 * @author Charles MK
 * Look up slang on Urban Dictionary.
 */

const axios = require("axios");

module.exports = {
  config: {
    name: "urban",
    aliases: ["ud", "urbandictionary", "slang"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Look up a word on Urban Dictionary",
    category: "utility",
    guide: "{pn} [slang term]\nExample: {pn} yeet",
  },

  onStart: async function ({ message, args }) {
    if (!args.length) return message.reply("❌ Provide a term.\nExample: /urban yeet");

    const term = args.join(" ");
    try {
      const { data } = await axios.get(
        `https://api.urbandictionary.com/v0/define?term=${encodeURIComponent(term)}`,
        { timeout: 8000 }
      );

      const results = data?.list;
      if (!results?.length) return message.reply(`❌ No definition found for "${term}".`);

      const top = results[0];
      const def  = top.definition.replace(/\[|\]/g, "").slice(0, 600);
      const ex   = top.example.replace(/\[|\]/g, "").slice(0, 300);

      return message.reply(
        `📖 𝗨𝗥𝗕𝗔𝗡 𝗗𝗜𝗖𝗧𝗜𝗢𝗡𝗔𝗥𝗬\n━━━━━━━━━━━━━━━━━━\n` +
        `📝 ${top.word}\n━━━━━━━━━━━━━━━━━━\n${def}\n` +
        `${ex ? `━━━━━━━━━━━━━━━━━━\n💬 Example:\n${ex}\n` : ""}` +
        `━━━━━━━━━━━━━━━━━━\n👍 ${top.thumbs_up} | 👎 ${top.thumbs_down}\n` +
        `✍️ by ${top.author}\n🤖 MKBOT by Charles MK`
      );
    } catch (err) {
      return message.reply("❌ Urban Dictionary lookup failed. Try again.");
    }
  },
};
