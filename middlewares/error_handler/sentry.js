const sentry = require('@sentry/node');
const { format } = require('date-fns');
const { IncomingWebhook } = require('@slack/client');

sentry.init({ dsn: process.env.SENTRY_DSN });
const webhook = new IncomingWebhook(process.env.SLACK_webhook_sentry);

const sentryHandler = (err, req, res, next) => {
  if (err.status === 404 || err.status > 500) {
    sentry.Handlers.errorHandler();
    webhook.send(
      {
        attachments: [
          {
            color: '#ff0000',
            text: '에러 발생?',
            fields: [
              {
                title: err.message,
                value: err.stack,
                short: false,
              },
            ],
            ts: `${format(new Date(), 'yyyy-MM-dd HH:mm:ss', { timezone: 'GMT-9' })}`,
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
  next();
};

module.exports = {
  sentryHandler,
};
