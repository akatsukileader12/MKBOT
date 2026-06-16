/**
 * MKBOT Command: recipe
 * @author Charles MK
 * Get a random recipe or search by ingredient using MealDB (free, no key needed).
 */

const axios = require("axios");

module.exports = {
  config: {
    name: "recipe",
    aliases: ["cook", "food", "meal"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Get a random recipe or search by name",
    category: "utility",
    guide: "{pn} — random recipe\n{pn} [dish name] — search a recipe",
  },

  onStart: async function ({ message, args }) {
    let data;
    if (args.length) {
      const query = args.join(" ");
      const res   = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`,
        { timeout: 8000 }
      ).catch(() => null);
      data = res?.data?.meals?.[0];
    } else {
      const res = await axios.get("https://www.themealdb.com/api/json/v1/1/random.php", { timeout: 8000 }).catch(() => null);
      data = res?.data?.meals?.[0];
    }

    if (!data) {
      return message.reply(args.length
        ? `❌ No recipe found for "${args.join(" ")}".`
        : "❌ Could not fetch recipe. Try again!"
      );
    }

    const name       = data.strMeal;
    const category   = data.strCategory;
    const area       = data.strArea;
    const instructions = (data.strInstructions || "").slice(0, 800);

    // Get ingredients
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ing   = data[`strIngredient${i}`];
      const meas  = data[`strMeasure${i}`];
      if (ing && ing.trim()) ingredients.push(`${meas?.trim() || ""} ${ing}`.trim());
    }

    return message.reply(
      `🍳 𝗥𝗘𝗖𝗜𝗣𝗘\n━━━━━━━━━━━━━━━━━━\n` +
      `📛 ${name}\n` +
      `📂 Category : ${category}\n` +
      `🌍 Cuisine  : ${area}\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `🥘 Ingredients:\n${ingredients.slice(0, 10).join(", ")}\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `📝 Instructions:\n${instructions}...\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `🔗 Full recipe: https://www.themealdb.com/meal/${data.idMeal}\n` +
      `🤖 MKBOT by Charles MK`
    );
  },
};
