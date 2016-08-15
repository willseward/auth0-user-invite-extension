import { expect } from 'chai';

const fs = require('fs');
const nodemailer = require('nodemailer');
const Email = require('../../../server/lib/email');

const templates = {
  subject: 'Definetely not spam!',
  text: 'Hello {{ name }}.\n{{ message }}',
  message: '<em>Hello <strong>{{ name }}</strong>.<h1>{{ message }}</h1>'
};

// skip this test if transporter-options.json doesn't exist (file with secrets)
var skip = false;
try {
  fs.statSync('tests/server/lib/transporter-options.json');
} catch (err) {
  console.log('Skipping test due to missing "transporter-options.json"');
  skip = true;
}
if (!skip) {
  var transporterOptions = require('./transporter-options.json');
}

var email;
describe('email with real credentials', () => {
  before(function () {
    if (skip) {
      this.skip();
    } else {
      email = new Email(transporterOptions, templates);
    }
  });

  it('# gets sent', function(done) {
    var context = { name: 'doge', message: 'such email' };
    email.sendEmail({ from: 'luke@yld.io', to: 'luke@yld.io' }, context, function(err, info) {
      expect(err).not.to.be.ok;
      return done();
    });
  });
});
