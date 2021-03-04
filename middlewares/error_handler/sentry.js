const Sentry = require('@sentry/node');
const { IncomingWebhook } = require('@slack/client');

Sentry.init({ dsn: process.env.SENTRY_DSN });
const webhook = new IncomingWebhook(process.env.SLACK_webhook_sentry);

const sendSlack = (err, req, res, next) => {
  webhook.send({
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
  });
  next(err);
};

const sentryHandler = (app, uncaught) => {
  app.use(
    Sentry.Handlers.errorHandler({
      shouldHandleError(err) {
        if (uncaught === false && err.status >= 500) {
          app.use(sendSlack);
          return true;
        }

        if (uncaught === true && err.status === undefined) {
          app.use(sendSlack);
          return true;
        }
        return false;
      },
    }),
  );
};

module.exports = {
  sendSlack,
  sentryHandler,
};
