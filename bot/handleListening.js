/**
 * MKBOT – Main listener
 * @author Charles MK
 * Wires up the FCA listen loop and routes every event to the right handler.
 */

const log         = require("../logger/log");
const handleChat  = require("./onChat");
const handleEvent = require("./onEvent");

const SPAM_WINDOW  = {}; // threadID → { count, firstAt }

function isSpamming(threadID) {
  const cfg  = global.GoatBot.config?.spamProtection;
  if (!cfg?.enable) return false;

  const threshold = cfg.commandThreshold || 5;
  const window    = (cfg.timeWindow || 10) * 1000;
  const now       = Date.now();
  const record    = SPAM_WINDOW[threadID];

  if (!record || now - record.firstAt > window) {
    SPAM_WINDOW[threadID] = { count: 1, firstAt: now };
    return false;
  }

  record.count++;
  return record.count > threshold;
}

module.exports = function startListening(api) {
  global.GoatBot.fcaApi = api;
  global.GoatBot.botID  = api.getCurrentUserID();

  log.info("LISTEN", "Listening for messages...");

  global.GoatBot.Listening = api.listenMqtt(async (err, event) => {
    if (err) {
      log.error("LISTEN", err.message || String(err));
      return;
    }

    try {
      if (event.type === "message" || event.type === "message_reply") {
        if (isSpamming(event.threadID)) return;
        await handleChat({ api, event });
      } else {
        await handleEvent({ api, event });
      }
    } catch (e) {
      log.error("LISTEN", `Unhandled error: ${e.message}`);
    }
  });
};
