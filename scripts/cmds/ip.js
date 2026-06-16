/**
 * MKBOT Command: ip
 * @author Charles MK
 * Look up IP address or domain geolocation.
 */

const axios = require("axios");

module.exports = {
  config: {
    name: "ip",
    aliases: ["iplookup", "geoip", "whois"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Look up IP/domain geolocation",
    category: "utility",
    guide: "{pn} [ip or domain]\nExample: {pn} 8.8.8.8\nExample: {pn} google.com",
  },

  onStart: async function ({ message, args }) {
    if (!args.length) return message.reply("❌ Usage: /ip [address]\nExample: /ip 8.8.8.8");

    const target = args[0].trim();

    try {
      const { data } = await axios.get(`http://ip-api.com/json/${encodeURIComponent(target)}?fields=66846719`, { timeout: 8000 });

      if (data.status === "fail") {
        return message.reply(`❌ Could not resolve "${target}". Check the IP or domain.`);
      }

      return message.reply(
        `🌐 𝗜𝗣 𝗟𝗢𝗢𝗞𝗨𝗣\n━━━━━━━━━━━━━━━━━━\n` +
        `🔢 IP       : ${data.query}\n` +
        `🏳️ Country  : ${data.country} (${data.countryCode})\n` +
        `🌆 Region   : ${data.regionName}\n` +
        `🏙️ City     : ${data.city}\n` +
        `📮 ZIP      : ${data.zip || "N/A"}\n` +
        `📍 Coords   : ${data.lat}, ${data.lon}\n` +
        `🌍 Timezone : ${data.timezone}\n` +
        `🔌 ISP      : ${data.isp}\n` +
        `🏢 Org      : ${data.org || "N/A"}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `🤖 MKBOT by Charles MK`
      );
    } catch (err) {
      return message.reply("❌ IP lookup failed. Try again later.");
    }
  },
};
