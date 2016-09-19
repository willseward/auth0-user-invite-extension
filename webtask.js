'use latest';

const nconf = require('nconf');
const Webtask = require('webtask-tools');

const logger = require('./server/lib/logger');
logger.info('Starting webtask.');

let server = null;
const getServer = (req, res) => {
  if (!server) {
    nconf
      .defaults({
        AUTH0_DOMAIN: req.webtaskContext.secrets.AUTH0_DOMAIN,
        AUTH0_CLIENT_ID: req.webtaskContext.secrets.AUTH0_CLIENT_ID,
        AUTH0_CLIENT_SECRET: req.webtaskContext.secrets.AUTH0_CLIENT_SECRET,
        EXTENSION_SECRET: req.webtaskContext.secrets.EXTENSION_SECRET,
        NODE_ENV: 'production',
        HOSTING_ENV: 'webtask',
        CLIENT_VERSION: process.env.CLIENT_VERSION,
        SMTP_HOST: req.webtaskContext.secrets.SMTP_HOST,
        SMTP_PORT: req.webtaskContext.secrets.SMTP_PORT,
        SMTP_SECURE: req.webtaskContext.secrets.SMTP_SECURE,
        SMTP_AUTH_USER: req.webtaskContext.secrets.SMTP_AUTH_USER,
        SMTP_AUTH_PASS: req.webtaskContext.secrets.SMTP_AUTH_PASS,
        CUSTOM_CSS: req.webtaskContext.secrets.CUSTOM_CSS,
        WT_URL: req.webtaskContext.secrets.WT_URL
      });

    // Start the server.
    server = require('./server')(req.webtaskContext.storage);
  }

  return server(req, res);
};

module.exports = Webtask.fromExpress((req, res) => getServer(req, res));
