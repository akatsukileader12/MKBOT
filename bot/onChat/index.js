/**
 * MKBOT – Chat message handler
 * @author Charles MK
 * Parses the prefix + command name from every incoming message and
 * dispatches to the matching command module.
 */

const log = require("../../logger/log");

module.exports = async function handleChat({ api, event }) {
  const { commands, aliases, config } = global.GoatBot;
  const { db } = global;

  const body = (event.body || "").trim();
  if (!body) return;

  /* ─── Resolve thread prefix ─────────────────────────────── */
  let prefix = config.prefix || "/";
  try {
    const thread = await db.threadsData.get(event.threadID);
    if (thread?.prefix) prefix = thread.prefix;
  } catch { /* use default */ }

  /* ─── Ensure thread doc exists ──────────────────────────── */
  try { await db.threadsData.get(event.threadID); } catch { /* ignore */ }

  /* ─── Ensure user doc exists ────────────────────────────── */
  try { await db.usersData.get(event.senderID); } catch { /* ignore */ }

  /* ─── Check onReply ─────────────────────────────────────── */
  if (event.messageReply) {
    const key = `${event.threadID}_${event.messageReply.messageID}`;
    const replyHandler = global.GoatBot.onReply?.get(key);
    if (replyHandler) {
      const cmd = commands.get(replyHandler.commandName);
      if (cmd?.onReply) {
        try {
          await cmd.onReply({
            api, event, args: body.split(" "),
            message: makeMessage(api, event),
            reply: replyHandler,
          });
        } catch (e) {
          log.error("CHAT", `onReply error [${replyHandler.commandName}]: ${e.message}`);
        }
      }
      return;
    }
  }

  /* ─── Check onReaction ──────────────────────────────────── */
  if (event.type === "message_reaction") {
    const key = `${event.threadID}_${event.messageID}`;
    const rxHandler = global.GoatBot.onReaction?.get(key);
    if (rxHandler) {
      const cmd = commands.get(rxHandler.commandName);
      if (cmd?.onReaction) {
        try {
          await cmd.onReaction({
            api, event,
            message: makeMessage(api, event),
            reaction: rxHandler,
          });
        } catch (e) {
          log.error("CHAT", `onReaction error [${rxHandler.commandName}]: ${e.message}`);
        }
      }
      return;
    }
  }

  /* ─── onChat hooks ──────────────────────────────────────── */
  for (const hook of global.GoatBot.onChat) {
    try {
      const cmd = commands.get(hook);
      if (cmd?.onChat) {
        await cmd.onChat({ api, event, args: body.split(" "), message: makeMessage(api, event), prefix });
      }
    } catch (e) {
      log.error("CHAT", `onChat error [${hook}]: ${e.message}`);
    }
  }

  /* ─── Prefix check ──────────────────────────────────────── */
  if (!body.startsWith(prefix)) return;

  const parts   = body.slice(prefix.length).trim().split(/\s+/);
  const rawName = parts[0].toLowerCase();
  const args    = parts.slice(1);

  const cmdName = aliases.get(rawName) || rawName;
  const cmd     = commands.get(cmdName);

  if (!cmd) return;

  /* ─── Permission check ──────────────────────────────────── */
  const role = cmd.config.role ?? 0;
  const senderID = event.senderID;

  const utils = global.utils;
  const userRole = utils.isDev(senderID) ? 4
    : utils.isAdmin(senderID)            ? 2
    : utils.isPremium(senderID)          ? 3
    : 0;

  if (userRole < role) {
    return api.sendMessage("⛔ You don't have permission to use this command.", event.threadID);
  }

  /* ─── Admin-only mode check ─────────────────────────────── */
  const adminOnly = global.GoatBot.config?.adminOnly;
  if (adminOnly?.enable) {
    const ignored = (adminOnly.ignoreCommand || []).map(s => s.toLowerCase());
    if (!ignored.includes(cmdName) && !utils.isAdmin(senderID) && !utils.isDev(senderID)) return;
  }

  /* ─── Run command ───────────────────────────────────────── */
  try {
    await cmd.onStart({
      api,
      event,
      args,
      prefix,
      message: makeMessage(api, event),
      usersData:   global.db.usersData,
      threadsData: global.db.threadsData,
      globalData:  global.db.globalData,
    });
  } catch (e) {
    log.error("CHAT", `Command error [${cmdName}]: ${e.message}`);
    api.sendMessage(`❌ Error: ${e.message}`, event.threadID);
  }
};

/* ─── Message helper ──────────────────────────────────────── */
function makeMessage(api, event) {
  return {
    reply: (body, callback) =>
      api.sendMessage(body, event.threadID, callback, event.messageID),
    send: (body, threadID, callback) =>
      api.sendMessage(body, threadID || event.threadID, callback),
    react: (emoji, messageID) =>
      api.setMessageReaction(emoji, messageID || event.messageID, null, true),
    unsend: (messageID) =>
      api.unsendMessage(messageID),
  };
}
