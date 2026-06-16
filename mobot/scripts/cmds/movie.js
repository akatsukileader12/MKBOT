/**
 * MKBOT Command: movie
 * @author Charles MK
 * Search for movie info using OMDB API.
 * Set OMDB_API_KEY env var for full access, or uses free tier (limited).
 */

const axios = require("axios");

module.exports = {
  config: {
    name: "movie",
    aliases: ["film", "omdb", "imdb"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Search for movie/TV show info",
    category: "utility",
    guide: "{pn} [title]\nExample: {pn} Avengers Endgame\nSet OMDB_API_KEY env var for full access",
  },

  onStart: async function ({ message, args }) {
    if (!args.length) return message.reply("❌ Provide a movie/show title.\nExample: /movie Interstellar");

    const title  = args.join(" ");
    const apiKey = process.env.OMDB_API_KEY || "trilogy";

    try {
      const { data } = await axios.get(
        `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}&plot=short`,
        { timeout: 8000 }
      );

      if (data.Response === "False") {
        return message.reply(`❌ Movie/show "${title}" not found.`);
      }

      const rating = data.imdbRating !== "N/A" ? `⭐ ${data.imdbRating}/10` : "Not rated";

      return message.reply(
        `🎬 𝗠𝗢𝗩𝗜𝗘 𝗜𝗡𝗙𝗢\n━━━━━━━━━━━━━━━━━━\n` +
        `📛 Title    : ${data.Title}\n` +
        `📅 Year     : ${data.Year}\n` +
        `🎭 Genre    : ${data.Genre}\n` +
        `⏱️ Runtime  : ${data.Runtime}\n` +
        `${rating}\n` +
        `🌍 Country  : ${data.Country}\n` +
        `🏆 Awards   : ${data.Awards}\n` +
        `🎬 Director : ${data.Director}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `📝 Plot:\n${data.Plot}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `🔗 IMDB: https://imdb.com/title/${data.imdbID}\n` +
        `🤖 MKBOT by Charles MK`
      );
    } catch (err) {
      return message.reply("❌ Movie lookup failed. Try again later.");
    }
  },
};
