// ─────────────────────────────────────────────────────
//  logger.js — Error tracking (Crashlytics-style)
//  Captures uncaught errors + unhandled promise rejections.
//  On localhost: logs to console only.
//  On production: forward to Firebase Crashlytics or Sentry
//  by uncommenting the relevant block in sendError() below.
// ─────────────────────────────────────────────────────

const Logger = {
  isDev: location.hostname === 'localhost' || location.hostname === '127.0.0.1',

  sendError(error, context) {
    if (this.isDev) {
      console.error('[Logger]', context, error);
      return;
    }

    // ── Option A: Firebase Crashlytics ────────────────
    // Requires Firebase SDK loaded before this file.
    // See SETUP.md for Firebase project setup steps.
    //
    // if (typeof firebase !== 'undefined') {
    //   firebase.crashlytics().recordError(error);
    // }

    // ── Option B: Sentry ──────────────────────────────
    // Requires Sentry SDK loaded before this file.
    // See SETUP.md for Sentry DSN setup steps.
    //
    // if (typeof Sentry !== 'undefined') {
    //   Sentry.withScope(scope => {
    //     scope.setExtras(context);
    //     Sentry.captureException(error);
    //   });
    // }

    // Fallback: silent in production until a service is wired up
    console.error('[Logger]', context, error);
  },

  init() {
    window.addEventListener('error', e => {
      this.sendError(e.error || new Error(e.message), {
        type:   'uncaught',
        source: e.filename,
        line:   e.lineno,
        col:    e.colno,
      });
    });

    window.addEventListener('unhandledrejection', e => {
      this.sendError(
        e.reason instanceof Error ? e.reason : new Error(String(e.reason)),
        { type: 'unhandledrejection' }
      );
    });
  },
};

Logger.init();
