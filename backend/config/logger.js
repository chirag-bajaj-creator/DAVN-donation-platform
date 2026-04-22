const pino = require('pino');
const pinoHttp = require('pino-http');

const level = process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug');

const logger = pino({
  level,
  base: {
    service: 'backend',
    env: process.env.NODE_ENV || 'development'
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'req.body.password',
      'req.body.adminSecret',
      'req.body.refreshToken',
      'res.headers["set-cookie"]'
    ],
    censor: '[REDACTED]'
  }
});

const httpLogger = pinoHttp({
  logger,
  genReqId: (req) => req.headers['x-request-id'] || undefined,
  customLogLevel: (req, res, error) => {
    if (error || res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    if (req.url === '/health') return 'silent';
    return 'info';
  },
  customSuccessMessage: (req) => `${req.method} ${req.url} completed`,
  customErrorMessage: (req, res, error) => `${req.method} ${req.url} failed: ${error.message}`,
  serializers: {
    req(req) {
      return {
        id: req.id,
        method: req.method,
        url: req.url,
        remoteAddress: req.remoteAddress,
        remotePort: req.remotePort
      };
    },
    res(res) {
      return {
        statusCode: res.statusCode
      };
    }
  }
});

module.exports = {
  logger,
  httpLogger
};
