const fs = require('fs');
const winston = require('winston');
require('winston-daily-rotate-file');

const logDir = __dirname + '/../logs';

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const infoTransport = new winston.transports.DailyRotateFile({
  filename: 'info_%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  dirname: logDir,
  level: 'info',
});

const errorTransport = new winston.transports.DailyRotateFile({
  filename: 'error_%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  dirname: logDir,
  level: 'error',
});

const logger = winston.createLogger({
  transports: [infoTransport, errorTransport],
});

const stream = {
  write: (message) => {
    logger.info(message);
  },
};

module.exports = { logger, stream };
