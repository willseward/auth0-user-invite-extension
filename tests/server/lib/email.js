import { expect } from 'chai';

const stubTransport = require('nodemailer-stub-transport');
const Email = require('../../../server/lib/email');

const templates = {
  subject: 'Definetely not spam!',
  text: 'Hello {{ name }}.\n{{ message }}',
  message: '<em>Hello <strong>{{ name }}</strong>.<h1>{{ message }}</h1>'
};
var email = new Email(stubTransport(), templates);

describe('email', () => {
  it('# gets sent', function(done) {
    var context = { name: 'doge', message: 'such email' };
    email.sendEmail({ to: 'joe@bloggs.com' }, context, function(err, info) {
      expect(err).not.to.be.ok;
      return done();
    });
  });

  it('# templating works', function(done) {
    var context = { name: 'doge', message: 'such email' };
    email.sendEmail({ to: 'joe@bloggs.com' }, context, function(err, info) {
      expect(info.response.toString()).to.contain('such email');
      return done();
    });
  });
});
