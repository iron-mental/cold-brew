const uriMethod = (value, helpers) => {
  const target = uriList[helpers.state.path[0]];

  if (target !== value.slice(0, target.length)) {
    return helpers.error('uri.invalidUri');
  }
  return value;
};

const uriList = {
  sns_appstore: 'https://apps.apple.com',
  sns_playstore: 'https://play.google.com',
  sns_notion: 'https://www.notion.so/',
  sns_evernote: 'https://www.evernote.com/',
  sns_linkedin: 'https://www.linkedin.com/',
  sns_web: 'https://',
};

module.exports = { uriMethod };
