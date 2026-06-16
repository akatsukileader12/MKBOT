/**
 * MKBOT Command: aesthetic
 * @author Charles MK
 * Convert text to aesthetic/fullwidth Unicode.
 */

const NORMAL  = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const AESTHETIC = "ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ０１２３４５６７８９";

function toAesthetic(text) {
  return text.split("").map(c => {
    const i = NORMAL.indexOf(c);
    return i >= 0 ? AESTHETIC[i] : c === " " ? "　" : c;
  }).join("");
}

module.exports = {
  config: {
    name: "aesthetic",
    aliases: ["vaporwave", "fullwidth", "aes"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Convert text to ａｅｓｔｈｅｔｉｃ fullwidth",
    category: "fun",
    guide: "{pn} [text] — convert to ａｅｓｔｈｅｔｉｃ",
  },

  onStart: async function ({ message, args, event }) {
    let text = args.join(" ").trim();
    if (!text && event.messageReply?.body) text = event.messageReply.body.trim();
    if (!text) return message.reply("❌ Give me text!\nExample: /aesthetic Hello World");

    return message.reply(toAesthetic(text));
  },
};
