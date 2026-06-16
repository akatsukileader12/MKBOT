/**
 * MKBOT Command: math
 * @author Charles MK
 * Evaluate a math expression safely.
 */

// Simple safe math evaluator — no eval, supports +,-,*,/,^,%,sqrt,abs,round,floor,ceil,pi,e
function safeMath(expr) {
  // Replace ^ with ** for exponentiation
  let e = expr
    .replace(/\^/g, "**")
    .replace(/pi/gi, String(Math.PI))
    .replace(/e(?![a-z])/gi, String(Math.E))
    .replace(/sqrt\s*\(([^)]+)\)/gi, (_, x) => `Math.sqrt(${x})`)
    .replace(/abs\s*\(([^)]+)\)/gi, (_, x) => `Math.abs(${x})`)
    .replace(/round\s*\(([^)]+)\)/gi, (_, x) => `Math.round(${x})`)
    .replace(/floor\s*\(([^)]+)\)/gi, (_, x) => `Math.floor(${x})`)
    .replace(/ceil\s*\(([^)]+)\)/gi, (_, x) => `Math.ceil(${x})`)
    .replace(/sin\s*\(([^)]+)\)/gi, (_, x) => `Math.sin(${x})`)
    .replace(/cos\s*\(([^)]+)\)/gi, (_, x) => `Math.cos(${x})`)
    .replace(/tan\s*\(([^)]+)\)/gi, (_, x) => `Math.tan(${x})`)
    .replace(/log\s*\(([^)]+)\)/gi, (_, x) => `Math.log(${x})`);

  // Only allow safe characters
  if (/[^0-9+\-*/.()%, Math.\s]/.test(e.replace(/Math\.\w+/g, ""))) {
    throw new Error("Unsafe expression");
  }

  // Use Function instead of eval for slightly safer scope
  const result = Function(`"use strict"; return (${e})`)();
  return result;
}

module.exports = {
  config: {
    name: "math",
    aliases: ["calc", "calculate", "compute"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Evaluate a math expression",
    category: "utility",
    guide: "{pn} [expression]\nExample: {pn} (3 + 4) * 2 ^ 3\nSupports: +, -, *, /, ^, %, sqrt, sin, cos, tan, log, abs, round, pi, e",
  },

  onStart: async function ({ message, args }) {
    if (!args.length) {
      return message.reply(
        "❌ Please provide a math expression.\n" +
        "Example: /math 2^10\n" +
        "Example: /math sqrt(144)\n" +
        "Example: /math sin(pi/2)"
      );
    }

    const expr = args.join(" ").trim();

    try {
      const result = safeMath(expr);

      if (typeof result !== "number" || !isFinite(result)) {
        return message.reply("❌ Invalid result — check your expression.");
      }

      // Format: no unnecessary decimal places
      const formatted = Number.isInteger(result) ? result : parseFloat(result.toFixed(10));

      return message.reply(
        `🧮 𝗠𝗔𝗧𝗛\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `📝 Input  : ${expr}\n` +
        `✅ Result : ${formatted}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `🤖 MKBOT by Charles MK`
      );
    } catch (err) {
      return message.reply(
        `❌ Math error: ${err.message}\n` +
        `Check your expression and try again.`
      );
    }
  },
};
