/**
 * MKBOT Command: anime
 * @author Charles MK
 * Search for anime info using Jikan API (MyAnimeList) — no key needed.
 */

const axios = require("axios");

module.exports = {
  config: {
    name: "anime",
    aliases: ["animeinfo", "mal"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Search for anime information",
    category: "fun",
    guide: "{pn} [anime name]\nExample: {pn} Naruto",
  },

  onStart: async function ({ message, args }) {
    if (!args.length) {
      return message.reply("❌ Please provide an anime name.\nExample: /anime Attack on Titan");
    }

    const query = args.join(" ");

    try {
      const { data } = await axios.get(
        `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=1`,
        { timeout: 10000 }
      );

      const anime = data?.data?.[0];
      if (!anime) {
        return message.reply(`❌ No anime found for "${query}".`);
      }

      const title   = anime.title_english || anime.title;
      const score   = anime.score || "N/A";
      const status  = anime.status || "Unknown";
      const eps     = anime.episodes || "?";
      const genres  = (anime.genres || []).map(g => g.name).join(", ") || "N/A";
      const type    = anime.type || "Unknown";
      const year    = anime.year || anime.aired?.prop?.from?.year || "N/A";
      const synopsis = (anime.synopsis || "No synopsis.").slice(0, 500);
      const rank    = anime.rank || "N/A";
      const members = (anime.members || 0).toLocaleString();

      return message.reply(
        `🌸 𝗔𝗡𝗜𝗠𝗘 𝗜𝗡𝗙𝗢\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `📺 Title    : ${title}\n` +
        `📅 Year     : ${year}\n` +
        `📊 Type     : ${type}\n` +
        `🎬 Episodes : ${eps}\n` +
        `⭐ Score    : ${score}/10\n` +
        `🏆 Rank     : #${rank}\n` +
        `👥 Members  : ${members}\n` +
        `📝 Status   : ${status}\n` +
        `🎭 Genres   : ${genres}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `📖 Synopsis:\n${synopsis}...\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `🔗 MAL: https://myanimelist.net/anime/${anime.mal_id}\n` +
        `🤖 MKBOT by Charles MK`
      );
    } catch (err) {
      return message.reply("❌ Anime search failed. Try again later.");
    }
  },
};
