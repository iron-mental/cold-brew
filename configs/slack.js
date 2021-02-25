const { format } = require('date-fns');
const { IncomingWebhook } = require('@slack/client');

const webhook = new IncomingWebhook(process.env.SLACK_webhook_general);

const attachments = {
  on: [
    {
      color: '#0000ff',
      text: 'Server On',
      ts: `${format(new Date(), 'yyyy-MM-dd HH:mm:ss', { timezone: 'GMT-9' })}`,
    },
  ],
  off: [
    {
      color: '#ff0000',
      text: 'Server Off',
      ts: `${format(new Date(), 'yyyy-MM-dd HH:mm:ss', { timezone: 'GMT-9' })}`,
    },
  ],
};

const send = (status) => {
  console.log('status: ', status);
  webhook.send({ attachments: attachments[status] }, (err, res) => {
    if (err) {
      sentry.captureException(err);
    }
  });
};

if (process.env.pm_id === '0') send('on');

process.on('SIGINT', () => {
  process.exit();
});

process.on('exit', () => {
  if (process.env.pm_id === '0') {
    send('off');
  }
});
