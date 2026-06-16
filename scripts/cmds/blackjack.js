/**
 * MKBOT Command: blackjack
 * @author Charles MK
 * Play Blackjack against the dealer.
 */

const SUITS  = ["♠","♥","♦","♣"];
const VALUES = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];

function makeDeck() {
  return SUITS.flatMap(s => VALUES.map(v => ({ suit: s, value: v })));
}
function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}
function cardVal(v) {
  if (v === "A") return 11;
  if (["J","Q","K"].includes(v)) return 10;
  return parseInt(v);
}
function handTotal(hand) {
  let total = hand.reduce((s, c) => s + cardVal(c.value), 0);
  let aces  = hand.filter(c => c.value === "A").length;
  while (total > 21 && aces > 0) { total -= 10; aces--; }
  return total;
}
function handStr(hand) {
  return hand.map(c => `${c.value}${c.suit}`).join(" ");
}

module.exports = {
  config: {
    name: "blackjack",
    aliases: ["bj", "21"],
    version: "1.0",
    author: "Charles MK",
    role: 0,
    shortDescription: "Play Blackjack (hit or stand)",
    category: "game",
    guide: "{pn} [bet] — start a game",
  },

  onStart: async function ({ message, args, event, usersData }) {
    const bet = parseInt(args[0]);
    if (!bet || bet < 10) return message.reply("❌ Minimum bet is 10.\nUsage: /bj [amount]");

    const user   = await usersData.get(event.senderID);
    const wallet = user?.money || 0;
    if (bet > wallet) return message.reply(`❌ You only have $${wallet.toLocaleString()}.`);

    const deck    = shuffle(makeDeck());
    const player  = [deck.pop(), deck.pop()];
    const dealer  = [deck.pop(), deck.pop()];
    const pTotal  = handTotal(player);

    // Natural blackjack
    if (pTotal === 21) {
      const won = Math.floor(bet * 1.5);
      await usersData.set(event.senderID, { money: wallet + won });
      return message.reply(
        `🃏 𝗕𝗟𝗔𝗖𝗞𝗝𝗔𝗖𝗞!\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `🎉 Natural 21! You win $${won.toLocaleString()}!\n` +
        `👤 Your hand: ${handStr(player)} (21)`
      );
    }

    const reply = await message.reply(
      `🃏 𝗕𝗟𝗔𝗖𝗞𝗝𝗔𝗖𝗞\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `💰 Bet: $${bet.toLocaleString()}\n` +
      `👤 Your: ${handStr(player)} (${pTotal})\n` +
      `🤖 Dealer: ${dealer[0].value}${dealer[0].suit} 🂠\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `Reply "hit" to draw or "stand" to stop!`
    );

    global.GoatBot.onReply.set(reply.messageID, {
      commandName: "blackjack",
      state: { player, dealer, deck, bet, wallet, senderID: event.senderID },
    });
  },

  onReply: async function ({ message, event, Reply, usersData }) {
    const { state } = Reply;
    if (event.senderID !== state.senderID) return;

    const { player, dealer, deck, bet, wallet } = state;
    const action = (event.body || "").toLowerCase().trim();

    global.GoatBot.onReply.delete(event.messageReply.messageID);

    if (action === "hit") {
      player.push(state.deck.pop());
      const pTotal = handTotal(player);

      if (pTotal > 21) {
        await usersData.set(event.senderID, { money: Math.max(0, wallet - bet) });
        return message.reply(
          `💥 𝗕𝗨𝗦𝗧!\n` +
          `━━━━━━━━━━━━━━━━━━\n` +
          `👤 Your: ${handStr(player)} (${pTotal})\n` +
          `😔 Over 21! You lose $${bet.toLocaleString()}.`
        );
      }

      if (pTotal === 21) {
        // Force stand
        action === "stand";
      } else {
        const newReply = await message.reply(
          `👤 Your: ${handStr(player)} (${pTotal})\n` +
          `🤖 Dealer: ${dealer[0].value}${dealer[0].suit} 🂠\n` +
          `Reply "hit" or "stand":`
        );
        global.GoatBot.onReply.set(newReply.messageID, { commandName: "blackjack", state });
        return;
      }
    }

    // Stand — dealer plays
    let dTotal = handTotal(dealer);
    while (dTotal < 17) {
      dealer.push(state.deck.pop());
      dTotal = handTotal(dealer);
    }

    const pTotal = handTotal(player);
    let result, delta;

    if (dTotal > 21 || pTotal > dTotal) {
      result = "🏆 YOU WIN!";
      delta  = bet;
    } else if (pTotal === dTotal) {
      result = "🤝 TIE!";
      delta  = 0;
    } else {
      result = "😔 DEALER WINS";
      delta  = -bet;
    }

    const newBal = Math.max(0, wallet + delta);
    await usersData.set(event.senderID, { money: newBal });

    return message.reply(
      `🃏 𝗕𝗟𝗔𝗖𝗞𝗝𝗔𝗖𝗞 𝗥𝗘𝗦𝗨𝗟𝗧\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `👤 Your  : ${handStr(player)} (${pTotal})\n` +
      `🤖 Dealer: ${handStr(dealer)} (${dTotal})\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `${result}\n` +
      `${delta > 0 ? `✅ Won $${delta}` : delta < 0 ? `❌ Lost $${Math.abs(delta)}` : "No change"}\n` +
      `💵 Balance: $${newBal.toLocaleString()}`
    );
  },
};
