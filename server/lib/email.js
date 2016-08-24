const nodemailer = require('nodemailer');

var transport;
var sendFn;

function sendEmail(emailOptions, templateData, callback) {
  sendFn(emailOptions, templateData, callback);
}

module.exports = function configure(smtpConfig, templates) {
  transport = nodemailer.createTransport(smtpConfig);
  sendFn = transport.templateSender(templates);
  return {
    sendEmail: sendEmail
  };
};
