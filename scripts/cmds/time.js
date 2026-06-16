/**
 * MKBOT Command: time
 * @author Charles MK
 */

module.exports = {
  config: {
    name: "time",
    aliases: ["date", "clock"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Show the current date and time",
    category: "utility",
    guide: "{pn}",
  },

  onStart: async function ({ message }) {
    const utils  = global.utils;
    const tz     = global.GoatBot.config?.timeZone || "Africa/Johannesburg";
    const time   = utils.getTime("HH:mm:ss", tz);
    const date   = utils.getTime("dddd, MMMM D YYYY", tz);

    message.reply(
      `🕐 𝗖𝗨𝗥𝗥𝗘𝗡𝗧 𝗧𝗜𝗠𝗘\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `📅 Date : ${date}\n` +
      `⏰ Time : ${time}\n` +
      `🌍 Zone : ${tz}`
    );
  },
};
