const { format } = require('date-fns');
const { IncomingWebhook } = require('@slack/client');

const webhook = new IncomingWebhook(process.env.SLACK_webhook_status);

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

const send = async (status) => {
  await webhook.send({ attachments: attachments[status] });
};

process.on('SIGINT', async () => {
  if (process.env.pm_id === '0') {
    await send('off');
  }
  process.exit();
});

if (process.env.pm_id === '0') send('on');
