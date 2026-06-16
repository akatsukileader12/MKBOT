/**
 * MKBOT – Facebook Login
 * @author Charles MK
 * Uses ws3-fca to log in via cookies from account.txt.
 *
 * Cookie normalisation: browser-exported cookies often have domain
 * "www.facebook.com" but fca makes requests to "www.messenger.com".
 * We duplicate every facebook.com cookie as a messenger.com cookie so
 * tough-cookie never rejects them.
 */

const fs      = require("fs-extra");
const path    = require("path");
const { login } = require("ws3-fca");
const log     = require("../../logger/log");
const Loading = require("../../logger/loading");

const accountPath = path.join(process.cwd(), "account.txt");

/* ─── Normalise cookies so messenger.com requests work ─────── */
function normalizeCookies(appState) {
  const extra = [];
  for (const cookie of appState) {
    const domain = (cookie.domain || "").toLowerCase();
    if (domain.includes("facebook.com")) {
      extra.push({
        ...cookie,
        domain: domain.replace("facebook.com", "messenger.com"),
      });
    }
  }
  return [...appState, ...extra];
}

function getAppState() {
  if (!fs.existsSync(accountPath)) {
    log.error("LOGIN", "account.txt not found. Please add your Facebook cookies.");
    process.exit(1);
  }

  const raw = fs.readFileSync(accountPath, "utf-8").trim();
  if (!raw || raw.includes("YOUR_SB_VALUE")) {
    log.error("LOGIN", "account.txt contains placeholder cookies. Please replace with your real cookies.");
    process.exit(1);
  }

  try {
    const parsed = JSON.parse(raw);
    return normalizeCookies(parsed);
  } catch {
    log.error("LOGIN", "account.txt is not valid JSON. Please check the format.");
    process.exit(1);
  }
}

function doLogin(config) {
  return new Promise((resolve, reject) => {
    const loader = new Loading("Logging in to Facebook...").start();
    const appState = getAppState();

    const loginOptions = {
      appState,
      userAgent: config.facebookAccount?.userAgent ||
        "Mozilla/5.0 (Linux; Android 14; SM-S928B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
      listenEvents: true,
      selfListen: false,
      autoMarkDelivery: false,
      autoMarkRead: false,
      forceLogin: false,
    };

    login(loginOptions, (err, api) => {
      if (err) {
        loader.fail("Login failed");
        log.error("LOGIN", err.message || String(err));
        return reject(err);
      }

      loader.success("Logged in to Facebook");
      log.success("LOGIN", `Bot ID: ${api.getCurrentUserID()}`);

      api.setOptions({
        listenEvents: true,
        selfListen: false,
        autoMarkDelivery: false,
        autoMarkRead: false,
      });

      // Save refreshed cookies back (facebook.com entries only, no duplicates)
      try {
        const fresh = (api.getAppState() || [])
          .filter(c => !(c.domain || "").includes("messenger.com"));
        fs.writeFileSync(accountPath, JSON.stringify(fresh, null, 2));
      } catch {
        log.warn("LOGIN", "Could not save updated cookies to account.txt");
      }

      resolve(api);
    });
  });
}

module.exports = { doLogin };
