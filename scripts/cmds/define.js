/**
 * MKBOT Command: define
 * @author Charles MK
 * Dictionary lookup using Free Dictionary API.
 */

const axios = require("axios");

module.exports = {
  config: {
    name: "define",
    aliases: ["dict", "dictionary", "meaning"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Look up the definition of a word",
    category: "utility",
    guide: "{pn} [word]\nExample: {pn} ephemeral",
  },

  onStart: async function ({ message, args }) {
    if (!args.length) {
      return message.reply("❌ Please provide a word to look up.\nExample: /define serendipity");
    }

    const word = args[0].toLowerCase();

    try {
      const { data } = await axios.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`,
        { timeout: 8000 }
      );

      if (!Array.isArray(data) || !data.length) {
        return message.reply(`❌ No definition found for "${word}".`);
      }

      const entry    = data[0];
      const phonetic = entry.phonetic || entry.phonetics?.find(p => p.text)?.text || "";
      const meanings = entry.meanings || [];

      let output = `📖 𝗗𝗘𝗙𝗜𝗡𝗜𝗧𝗜𝗢𝗡\n━━━━━━━━━━━━━━━━━━\n`;
      output    += `📝 Word: ${entry.word}\n`;
      if (phonetic) output += `🔊 Pronunciation: ${phonetic}\n`;
      output    += `━━━━━━━━━━━━━━━━━━\n`;

      let count = 0;
      for (const meaning of meanings.slice(0, 2)) {
        output += `\n🔹 (${meaning.partOfSpeech})\n`;
        for (const def of meaning.definitions.slice(0, 2)) {
          count++;
          output += `  ${count}. ${def.definition}\n`;
          if (def.example) output += `     💬 Example: "${def.example}"\n`;
        }
      }

      if (entry.meanings?.[0]?.synonyms?.length) {
        output += `\n🔄 Synonyms: ${entry.meanings[0].synonyms.slice(0, 5).join(", ")}`;
      }

      output += `\n━━━━━━━━━━━━━━━━━━\n🤖 MKBOT by Charles MK`;

      return message.reply(output);
    } catch (err) {
      if (err.response?.status === 404) {
        return message.reply(`❌ No definition found for "${word}".`);
      }
      return message.reply("❌ Dictionary lookup failed. Try again later.");
    }
  },
};
