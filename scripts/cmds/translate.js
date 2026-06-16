/**
 * MKBOT Command: translate
 * @author Charles MK
 * Translate text using MyMemory free API (no key needed).
 */

const axios = require("axios");

const LANG_NAMES = {
  en: "English", af: "Afrikaans", sq: "Albanian", ar: "Arabic",
  az: "Azerbaijani", eu: "Basque", be: "Belarusian", bn: "Bengali",
  bs: "Bosnian", bg: "Bulgarian", ca: "Catalan", zh: "Chinese",
  hr: "Croatian", cs: "Czech", da: "Danish", nl: "Dutch",
  eo: "Esperanto", et: "Estonian", fi: "Finnish", fr: "French",
  gl: "Galician", ka: "Georgian", de: "German", el: "Greek",
  gu: "Gujarati", ht: "Haitian Creole", ha: "Hausa", he: "Hebrew",
  hi: "Hindi", hu: "Hungarian", is: "Icelandic", id: "Indonesian",
  ga: "Irish", it: "Italian", ja: "Japanese", kn: "Kannada",
  kk: "Kazakh", ko: "Korean", lv: "Latvian", lt: "Lithuanian",
  mk: "Macedonian", ms: "Malay", mt: "Maltese", mr: "Marathi",
  mn: "Mongolian", no: "Norwegian", pl: "Polish", pt: "Portuguese",
  pa: "Punjabi", ro: "Romanian", ru: "Russian", sr: "Serbian",
  sk: "Slovak", sl: "Slovenian", so: "Somali", es: "Spanish",
  sw: "Swahili", sv: "Swedish", tl: "Filipino", ta: "Tamil",
  te: "Telugu", th: "Thai", tr: "Turkish", uk: "Ukrainian",
  ur: "Urdu", vi: "Vietnamese", cy: "Welsh", yi: "Yiddish",
  zu: "Zulu",
};

module.exports = {
  config: {
    name: "translate",
    aliases: ["tr", "tl"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Translate text to another language",
    category: "utility",
    guide: "{pn} [lang] [text]\nExample: {pn} fr Hello world",
  },

  onStart: async function ({ message, args }) {
    if (args.length < 2) {
      return message.reply(
        "❌ Usage: /translate [lang] [text]\n" +
        "Example: /translate fr Hello world\n" +
        "Example: /translate ja How are you?\n\n" +
        "Common codes: en fr es de ja ko zh ar pt ru"
      );
    }

    const target = args[0].toLowerCase();
    const text   = args.slice(1).join(" ");

    if (!LANG_NAMES[target]) {
      return message.reply(
        `❌ Unknown language code: "${target}"\n` +
        `Common codes: en, fr, es, de, ja, ko, zh, ar, pt, ru, hi, tr, it`
      );
    }

    try {
      const { data } = await axios.get(
        `https://api.mymemory.translated.net/get`,
        {
          params: { q: text, langpair: `en|${target}` },
          timeout: 10000,
        }
      );

      const translated = data?.responseData?.translatedText;
      if (!translated || data?.responseStatus !== 200) {
        return message.reply("❌ Translation failed. Try again later.");
      }

      return message.reply(
        `🌐 𝗧𝗥𝗔𝗡𝗦𝗟𝗔𝗧𝗜𝗢𝗡\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `🔤 From : English\n` +
        `🌍 To   : ${LANG_NAMES[target]}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `📝 Input:\n${text}\n\n` +
        `✨ Output:\n${translated}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `🤖 MKBOT by Charles MK`
      );
    } catch (err) {
      return message.reply("❌ Translation error. Please try again.");
    }
  },
};
