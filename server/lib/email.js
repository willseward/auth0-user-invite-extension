const nodemailer = require('nodemailer');

var transport;
var sendFn;

function sendEmail(emailOptions, templateData, callback) {
  sendFn(emailOptions, templateData, callback);
}

module.exports = function configure(transportOptions, templates) {
  transport = nodemailer.createTransport(transportOptions);
  sendFn = transport.templateSender(templates);
  return {
    sendEmail: sendEmail
  };
};
