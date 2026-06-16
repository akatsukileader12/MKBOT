/**
 * MKBOT Command: color
 * @author Charles MK
 * Get info about a color (hex, rgb, hsl, name).
 */

const axios = require("axios");

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

module.exports = {
  config: {
    name: "color",
    aliases: ["colour", "hex", "colorinfo"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Get info about a color by hex code",
    category: "utility",
    guide: "{pn} [hex code]\nExample: {pn} #FF5733\nExample: {pn} random",
  },

  onStart: async function ({ message, args }) {
    let hex = (args[0] || "random").replace("#", "").trim();

    if (hex.toLowerCase() === "random") {
      hex = Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, "0");
    }

    if (!/^[0-9a-fA-F]{6}$/.test(hex)) {
      return message.reply("❌ Invalid hex code. Example: /color FF5733");
    }

    const rgb = hexToRgb(hex);

    try {
      const { data } = await axios.get(
        `https://www.thecolorapi.com/id?hex=${hex}&format=json`,
        { timeout: 6000 }
      );

      const name    = data?.name?.value || "Unknown";
      const hsl     = data?.hsl?.value || "N/A";
      const hsv     = data?.hsv?.value || "N/A";
      const closest = data?.name?.closest_named_hex || "#" + hex;

      return message.reply(
        `🎨 𝗖𝗢𝗟𝗢𝗥 𝗜𝗡𝗙𝗢\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `📛 Name : ${name}\n` +
        `🔵 HEX  : #${hex.toUpperCase()}\n` +
        `🔴 RGB  : rgb(${rgb.r}, ${rgb.g}, ${rgb.b})\n` +
        `💚 HSL  : ${hsl}\n` +
        `🟡 HSV  : ${hsv}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `🔗 Preview: https://www.colorhexa.com/${hex}\n` +
        `🤖 MKBOT by Charles MK`
      );
    } catch {
      return message.reply(
        `🎨 𝗖𝗢𝗟𝗢𝗥 𝗜𝗡𝗙𝗢\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `🔵 HEX : #${hex.toUpperCase()}\n` +
        `🔴 RGB : rgb(${rgb.r}, ${rgb.g}, ${rgb.b})\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `🤖 MKBOT by Charles MK`
      );
    }
  },
};
