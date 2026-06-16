/**
 * MKBOT Command: password
 * @author Charles MK
 * Generate a secure random password.
 */

const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS   = "0123456789";
const SYMBOLS   = "!@#$%^&*()-_=+[]{}|;:,.<>?";

function generatePassword(length, { upper, numbers, symbols }) {
  let charset = LOWERCASE;
  if (upper)   charset += UPPERCASE;
  if (numbers) charset += NUMBERS;
  if (symbols) charset += SYMBOLS;

  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }
  return password;
}

module.exports = {
  config: {
    name: "password",
    aliases: ["passgen", "genpassword"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Generate a secure random password",
    category: "utility",
    guide: "{pn} [length] [flags]\nFlags: -u (uppercase) -n (numbers) -s (symbols)\nExample: {pn} 16 -uns",
  },

  onStart: async function ({ message, args }) {
    const length  = Math.min(Math.max(parseInt(args[0]) || 12, 4), 64);
    const flags   = (args[1] || "-uns").toLowerCase();

    const opts = {
      upper:   flags.includes("u"),
      numbers: flags.includes("n"),
      symbols: flags.includes("s"),
    };

    const passwords = [
      generatePassword(length, opts),
      generatePassword(length, opts),
      generatePassword(length, opts),
    ];

    const strength = (length >= 16 && opts.upper && opts.numbers && opts.symbols) ? "🟢 Strong" :
                     (length >= 12) ? "🟡 Medium" : "🔴 Weak";

    return message.reply(
      `🔐 𝗣𝗔𝗦𝗦𝗪𝗢𝗥𝗗 𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗢𝗥\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `📏 Length  : ${length}\n` +
      `⚙️ Options : ${opts.upper ? "Uppercase " : ""}${opts.numbers ? "Numbers " : ""}${opts.symbols ? "Symbols" : ""}\n` +
      `💪 Strength: ${strength}\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      passwords.map((p, i) => `${i + 1}. \`${p}\``).join("\n") +
      `\n━━━━━━━━━━━━━━━━━━\n` +
      `⚠️ Don't share passwords in public chats!\n` +
      `🤖 MKBOT by Charles MK`
    );
  },
};
