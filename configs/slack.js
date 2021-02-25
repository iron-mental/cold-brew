const { IncomingWebhook } = require('@slack/client');

const webhook = new IncomingWebhook(process.env.SLACK_webhook_status);

const attachments = {
  on: [
    {
      color: '#0000ff',
      text: 'Server On',
    },
  ],
  off: [
    {
      color: '#ff0000',
      text: 'Server Off',
    },
  ],
};

const send = async (status) => {
  await webhook.send({ attachments: attachments[status] });
};

(() => {
  if (process.env.pm_id === '0') {
    send('on');
  }
})();

process.on('SIGINT', async () => {
  if (process.env.pm_id === '0') {
    await send('off');
  }
  process.exit();
});
