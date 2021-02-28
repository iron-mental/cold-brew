const fs = require('fs');
const winston = require('winston');
require('winston-daily-rotate-file');

const logDir = __dirname + '/../logs';

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const infoTransport = new winston.transports.DailyRotateFile({
  level: 'info',
  dirname: logDir,
  datePattern: 'YYYY-MM-DD-HH',
  filename: 'info_%DATE%.log',
  zippedArchive: true,
});

const errorTransport = new winston.transports.DailyRotateFile({
  level: 'error',
  dirname: logDir + '/error',
  datePattern: 'YYYY-MM-DD-HH',
  filename: 'error_%DATE%.log',
  zippedArchive: true,
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
