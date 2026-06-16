/**
 * MKBOT Command: bold
 * @author Charles MK
 * Convert text to bold/italic/strikethrough Unicode styles.
 */

const MAPS = {
  bold: { from: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", to: "𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵" },
  italic: { from: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", to: "𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻" },
  small: { from: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", to: "ᴬᴮᶜᴰᴱᶠᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾQᴿˢᵀᵁᵛᵂˣʸᶻᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖqʳˢᵗᵘᵛʷˣʸᶻ" },
};

function convert(text, style) {
  const map = MAPS[style];
  if (!map) return text;
  return text.split("").map(c => {
    const i = map.from.indexOf(c);
    return i >= 0 ? map.to[i] : c;
  }).join("");
}

module.exports = {
  config: {
    name: "bold",
    aliases: ["italic", "smallcaps", "textstyle"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Convert text to bold/italic/small caps Unicode",
    category: "fun",
    guide: "{pn} [text] — bold\n{pn} italic [text] — italic\n{pn} small [text] — small caps",
  },

  onStart: async function ({ message, args, event }) {
    const sub  = (args[0] || "").toLowerCase();
    const styles = ["italic", "small"];
    let style = "bold";
    let text;

    if (styles.includes(sub)) {
      style = sub;
      text  = args.slice(1).join(" ").trim();
    } else {
      text = args.join(" ").trim();
    }

    if (!text && event.messageReply?.body) text = event.messageReply.body.trim();
    if (!text) return message.reply("❌ Give me text!\nExample: /bold Hello World");

    return message.reply(convert(text, style));
  },
};
