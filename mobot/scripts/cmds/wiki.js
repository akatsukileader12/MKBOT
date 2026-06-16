/**
 * MKBOT Command: wiki
 * @author Charles MK
 * Wikipedia search using the free Wikipedia API.
 */

const axios = require("axios");

module.exports = {
  config: {
    name: "wiki",
    aliases: ["wikipedia", "search"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Search Wikipedia for a topic",
    category: "utility",
    guide: "{pn} [topic]\nExample: {pn} Elon Musk",
  },

  onStart: async function ({ message, args }) {
    if (!args.length) {
      return message.reply("❌ Please provide a search term.\nExample: /wiki Albert Einstein");
    }

    const query = args.join(" ");

    try {
      // Search for the page
      const searchRes = await axios.get("https://en.wikipedia.org/w/api.php", {
        params: {
          action: "query",
          list: "search",
          srsearch: query,
          format: "json",
          srlimit: 1,
        },
        timeout: 8000,
      });

      const results = searchRes.data?.query?.search;
      if (!results?.length) {
        return message.reply(`❌ No Wikipedia results for "${query}".`);
      }

      const title = results[0].title;

      // Get the summary
      const summaryRes = await axios.get("https://en.wikipedia.org/w/api.php", {
        params: {
          action: "query",
          titles: title,
          prop: "extracts",
          exintro: true,
          explaintext: true,
          format: "json",
        },
        timeout: 8000,
      });

      const pages = summaryRes.data?.query?.pages;
      const page  = Object.values(pages)[0];
      const extract = page?.extract?.trim() || "No summary available.";

      // Trim to 1500 chars
      const summary = extract.length > 1500
        ? extract.slice(0, 1497) + "..."
        : extract;

      const url = `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`;

      return message.reply(
        `📚 𝗪𝗜𝗞𝗜𝗣𝗘𝗗𝗜𝗔\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `📖 ${title}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `${summary}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `🔗 ${url}`
      );
    } catch (err) {
      return message.reply("❌ Wikipedia search failed. Please try again.");
    }
  },
};
