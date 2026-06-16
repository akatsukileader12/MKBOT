/**
 * MKBOT Command: lyrics
 * @author Charles MK
 * Search song lyrics using Lyrics.ovh (free, no key needed).
 */

const axios = require("axios");

module.exports = {
  config: {
    name: "lyrics",
    aliases: ["lyric", "songlyrics"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Find song lyrics",
    category: "media",
    guide: "{pn} [artist] - [song]\nExample: {pn} Eminem - Lose Yourself",
  },

  onStart: async function ({ message, args }) {
    const input = args.join(" ");
    if (!input.includes("-")) {
      return message.reply("❌ Usage: /lyrics [artist] - [song]\nExample: /lyrics Adele - Hello");
    }

    const [artist, ...songParts] = input.split("-");
    const song = songParts.join("-").trim();

    try {
      const { data } = await axios.get(
        `https://api.lyrics.ovh/v1/${encodeURIComponent(artist.trim())}/${encodeURIComponent(song)}`,
        { timeout: 10000 }
      );

      if (!data?.lyrics) return message.reply(`❌ No lyrics found for "${song}" by "${artist.trim()}".`);

      const lyrics = data.lyrics.trim().slice(0, 1800);

      return message.reply(
        `🎵 𝗟𝗬𝗥𝗜𝗖𝗦\n━━━━━━━━━━━━━━━━━━\n` +
        `🎤 ${artist.trim()} — ${song}\n━━━━━━━━━━━━━━━━━━\n` +
        `${lyrics}${data.lyrics.length > 1800 ? "\n...(truncated)" : ""}\n` +
        `━━━━━━━━━━━━━━━━━━\n🤖 MKBOT by Charles MK`
      );
    } catch (err) {
      if (err.response?.status === 404) {
        return message.reply(`❌ Lyrics not found for "${song}" by "${artist.trim()}".`);
      }
      return message.reply("❌ Lyrics service unavailable. Try again later.");
    }
  },
};
