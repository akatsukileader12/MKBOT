/**
 * MKBOT Command: horoscope
 * @author Charles MK
 * Get today's horoscope for a zodiac sign.
 */

const axios = require("axios");

const SIGNS = ["aries","taurus","gemini","cancer","leo","virgo","libra","scorpio","sagittarius","capricorn","aquarius","pisces"];
const SIGN_EMOJIS = {
  aries: "♈", taurus: "♉", gemini: "♊", cancer: "♋",
  leo: "♌", virgo: "♍", libra: "♎", scorpio: "♏",
  sagittarius: "♐", capricorn: "♑", aquarius: "♒", pisces: "♓",
};

module.exports = {
  config: {
    name: "horoscope",
    aliases: ["zodiac", "horo"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Get your daily horoscope",
    category: "fun",
    guide: "{pn} [sign]\nExample: {pn} leo\nSigns: aries, taurus, gemini, cancer, leo, virgo, libra, scorpio, sagittarius, capricorn, aquarius, pisces",
  },

  onStart: async function ({ message, args }) {
    const sign = (args[0] || "").toLowerCase();

    if (!sign || !SIGNS.includes(sign)) {
      return message.reply(
        "❌ Please provide a zodiac sign.\n" +
        "Example: /horoscope leo\n\n" +
        "♈ aries ♉ taurus ♊ gemini ♋ cancer\n" +
        "♌ leo ♍ virgo ♎ libra ♏ scorpio\n" +
        "♐ sagittarius ♑ capricorn ♒ aquarius ♓ pisces"
      );
    }

    try {
      const { data } = await axios.post(
        "https://aztro.sameerkumar.website/",
        null,
        {
          params: { sign, day: "today" },
          timeout: 8000,
        }
      );

      return message.reply(
        `${SIGN_EMOJIS[sign]} 𝗛𝗢𝗥𝗢𝗦𝗖𝗢𝗣𝗘 — ${sign.toUpperCase()}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `📅 Date : ${data.current_date}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `${data.description}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `❤️ Mood    : ${data.mood}\n` +
        `🍀 Lucky # : ${data.lucky_number}\n` +
        `🎨 Color   : ${data.color}\n` +
        `💝 Compat  : ${data.compatibility}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `🤖 MKBOT by Charles MK`
      );
    } catch (err) {
      return message.reply("❌ Horoscope service unavailable. Try again later.");
    }
  },
};
