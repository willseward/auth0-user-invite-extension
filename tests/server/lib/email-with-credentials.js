import { expect } from 'chai';

const fs = require('fs');
const nodemailer = require('nodemailer');
const Email = require('../../../server/lib/email');

const templates = {
  subject: 'Definetely not spam!',
  text: 'Hello {{ name }}.\n{{ html }}',
  html: 'Hello <strong>{{ name }}</strong>.<h1>{{ html }}</h1>'
};

// skip this test if transporter-options.json doesn't exist (file with secrets)
let skip = false;
let transporterOptions;
let email;

try {
  fs.statSync('tests/server/lib/transporter-options.json');
} catch (err) {
  console.log('Skipping test due to missing "transporter-options.json"');
  skip = true;
}
if (!skip) {
  transporterOptions = require('./transporter-options.json');
}

describe('email with real credentials', () => {
  before(function () {
    if (skip) {
      this.skip();
    } else {
      email = new Email(transporterOptions, templates);
    }
  });

  it('# gets sent', function(done) {
    const context = { name: 'doge', html: 'such email' };
    email.sendEmail({ from: 'luke@yld.io', to: 'luke@yld.io' }, context, function(err, info) {
      expect(err).not.to.be.ok;
      return done();
    });
  });
});
