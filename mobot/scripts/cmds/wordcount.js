/**
 * MKBOT Command: wordcount
 * @author Charles MK
 * Count words, characters, and sentences in a text.
 */

module.exports = {
  config: {
    name: "wordcount",
    aliases: ["wc", "countwords", "charcount"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Count words, characters, and lines in text",
    category: "utility",
    guide: "{pn} [text] — count words/chars\nOr reply to a message with {pn}",
  },

  onStart: async function ({ message, args, event }) {
    let text = args.join(" ").trim();

    if (!text && event.messageReply?.body) {
      text = event.messageReply.body.trim();
    }

    if (!text) {
      return message.reply("❌ Provide text to count, or reply to a message.\nExample: /wc Hello world");
    }

    const words      = text.match(/\S+/g)?.length || 0;
    const chars      = text.length;
    const charsNoSp  = text.replace(/\s/g, "").length;
    const sentences  = text.split(/[.!?]+/).filter(s => s.trim()).length;
    const lines      = text.split(/\n/).length;
    const paragraphs = text.split(/\n{2,}/).filter(p => p.trim()).length;

    return message.reply(
      `📊 𝗧𝗘𝗫𝗧 𝗔𝗡𝗔𝗟𝗬𝗦𝗜𝗦\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `📝 Words         : ${words}\n` +
      `🔤 Characters    : ${chars}\n` +
      `🔡 Chars (no sp) : ${charsNoSp}\n` +
      `📖 Sentences     : ${sentences}\n` +
      `📄 Lines         : ${lines}\n` +
      `📑 Paragraphs    : ${paragraphs}\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `🤖 MKBOT by Charles MK`
    );
  },
};
