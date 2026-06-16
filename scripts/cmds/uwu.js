/**
 * MKBOT Command: uwu
 * @author Charles MK
 * UwUify text.
 */

function uwuify(text) {
  return text
    .replace(/[lr]/g, "w")
    .replace(/[LR]/g, "W")
    .replace(/n([aeiou])/g, "ny$1")
    .replace(/N([aeiou])/g, "Ny$1")
    .replace(/ove/g, "uv")
    .replace(/\!/g, " OwO!")
    .replace(/\?/g, " UwU?")
    .replace(/\./g, " :3.")
    + " UwU";
}

module.exports = {
  config: {
    name: "uwu",
    aliases: ["uwuify", "owofy"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "UwUify any text",
    category: "fun",
    guide: "{pn} [text] — UwUify your text\nOr reply to a message with {pn}",
  },

  onStart: async function ({ message, args, event }) {
    let text = args.join(" ").trim();
    if (!text && event.messageReply?.body) text = event.messageReply.body.trim();
    if (!text) return message.reply("❌ Give me text to UwUify!\nExample: /uwu Hello world");

    return message.reply(uwuify(text));
  },
};
