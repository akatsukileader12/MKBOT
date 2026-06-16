/**
 * MKBOT Command: weather
 * @author Charles MK
 * Fetches weather from wttr.in (no API key needed).
 */

const axios = require("axios");

module.exports = {
  config: {
    name: "weather",
    aliases: ["wthr", "forecast"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Get current weather for a location",
    category: "utility",
    guide: "{pn} [city name]\nExample: {pn} Johannesburg",
  },

  onStart: async function ({ message, args }) {
    if (!args.length) {
      return message.reply("❌ Please provide a city name.\nExample: /weather Johannesburg");
    }

    const city = args.join(" ");
    try {
      const { data } = await axios.get(
        `https://wttr.in/${encodeURIComponent(city)}?format=j1`,
        { timeout: 8000 }
      );

      const current  = data.current_condition[0];
      const area     = data.nearest_area[0];
      const areaName = area.areaName[0].value;
      const country  = area.country[0].value;
      const temp_c   = current.temp_C;
      const temp_f   = current.temp_F;
      const feelsC   = current.FeelsLikeC;
      const humidity = current.humidity;
      const windKph  = current.windspeedKmph;
      const desc     = current.weatherDesc[0].value;
      const visibility = current.visibility;

      message.reply(
        `🌤️ 𝗪𝗘𝗔𝗧𝗛𝗘𝗥 𝗥𝗘𝗣𝗢𝗥𝗧\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `📍 Location  : ${areaName}, ${country}\n` +
        `🌡️ Temp      : ${temp_c}°C / ${temp_f}°F\n` +
        `🤔 Feels Like: ${feelsC}°C\n` +
        `☁️ Condition : ${desc}\n` +
        `💧 Humidity  : ${humidity}%\n` +
        `💨 Wind      : ${windKph} km/h\n` +
        `👁️ Visibility: ${visibility} km\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `🤖 MKBOT by Charles MK`
      );
    } catch (err) {
      message.reply(
        `❌ Could not fetch weather for "${city}".\n` +
        `Make sure the city name is correct.`
      );
    }
  },
};
