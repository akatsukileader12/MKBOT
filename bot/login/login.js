/**
 * MKBOT – Facebook Login
 * @author Charles MK
 * Uses fca-unofficial to log in via cookies from account.txt.
 */

const fs      = require("fs-extra");
const path    = require("path");
const login   = require("fca-unofficial");
const log     = require("../../logger/log");
const Loading = require("../../logger/loading");

const accountPath = path.join(process.cwd(), "account.txt");

function getAppState() {
  if (!fs.existsSync(accountPath)) {
    log.error("LOGIN", "account.txt not found. Please add your Facebook cookies.");
    process.exit(1);
  }

  const raw = fs.readFileSync(accountPath, "utf-8").trim();
  if (!raw || raw.includes("YOUR_SB_VALUE")) {
    log.error("LOGIN", "account.txt contains placeholder cookies. Please replace with your real Facebook cookies.");
    process.exit(1);
  }

  try {
    return JSON.parse(raw);
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
      logLevel: "silent",
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

      // Set API options
      api.setOptions({
        listenEvents: true,
        selfListen: false,
        logLevel: "silent",
        autoMarkDelivery: false,
        autoMarkRead: false,
      });

      // Save updated cookies
      try {
        fs.writeFileSync(accountPath, JSON.stringify(api.getAppState(), null, 2));
      } catch {
        log.warn("LOGIN", "Could not save updated cookies to account.txt");
      }

      resolve(api);
    });
  });
}

module.exports = { doLogin };
