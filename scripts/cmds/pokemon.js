/**
 * MKBOT Command: pokemon
 * @author Charles MK
 * Look up Pokémon info using PokeAPI (free, no key needed).
 */

const axios = require("axios");

module.exports = {
  config: {
    name: "pokemon",
    aliases: ["poke", "pokedex"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Look up any Pokémon",
    category: "fun",
    guide: "{pn} [name or number]\nExample: {pn} pikachu\nExample: {pn} 25",
  },

  onStart: async function ({ message, args }) {
    if (!args.length) return message.reply("❌ Provide a Pokémon name or number.\nExample: /pokemon charmander");

    const query = args[0].toLowerCase().trim();

    try {
      const { data } = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(query)}`,
        { timeout: 8000 }
      );

      const name    = data.name.charAt(0).toUpperCase() + data.name.slice(1);
      const id      = data.id.toString().padStart(3, "0");
      const types   = data.types.map(t => t.type.name).join(", ");
      const height  = data.height / 10;
      const weight  = data.weight / 10;
      const hp      = data.stats.find(s => s.stat.name === "hp")?.base_stat;
      const atk     = data.stats.find(s => s.stat.name === "attack")?.base_stat;
      const def     = data.stats.find(s => s.stat.name === "defense")?.base_stat;
      const spd     = data.stats.find(s => s.stat.name === "speed")?.base_stat;
      const moves   = data.moves.slice(0, 4).map(m => m.move.name).join(", ");

      return message.reply(
        `🎮 𝗣𝗢𝗞É𝗗𝗘𝗫\n━━━━━━━━━━━━━━━━━━\n` +
        `#${id} ${name}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `🔷 Type   : ${types}\n` +
        `📏 Height : ${height}m\n` +
        `⚖️ Weight : ${weight}kg\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `❤️ HP    : ${hp}\n` +
        `⚔️ ATK   : ${atk}\n` +
        `🛡️ DEF   : ${def}\n` +
        `💨 SPD   : ${spd}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `🎯 Moves : ${moves}\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `🤖 MKBOT by Charles MK`
      );
    } catch (err) {
      if (err.response?.status === 404) return message.reply(`❌ Pokémon "${query}" not found.`);
      return message.reply("❌ PokéAPI error. Try again.");
    }
  },
};
