const sentry = require('@sentry/node');
const { format } = require('date-fns');
const { IncomingWebhook } = require('@slack/client');

sentry.init({ dsn: process.env.SENTRY_DSN });
const webhook = new IncomingWebhook(process.env.SLACK_webhook_sentry);

const sentryHandler = (err, req, res, next) => {
  if (err.status === 404 || err.status >= 500 || !err.status) {
    sentry.Handlers.errorHandler();
    if (err.status >= 500 || !err.status) {
      webhook.send(
        {
          attachments: [
            {
              color: '#ff0000',
              fields: [
                {
                  title: err.message,
                  value: err.stack,
                  short: false,
                },
              ],
              ts: new Date().getTime() / 1000,
            },
          ],
        },
        (err, res) => {
          if (err) {
            sentry.captureException(err);
          }
        },
      );
    }
  }
  next(err);
};

module.exports = {
  sentryHandler,
};
