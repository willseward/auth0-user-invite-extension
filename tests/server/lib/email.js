import { expect } from 'chai';

const stubTransport = require('nodemailer-stub-transport');
const Email = require('../../../server/lib/email');

const templates = {
  subject: 'Definetely not spam!',
  text: 'Hello {{ name }}.\n{{ html }}',
  html: 'Hello <strong>{{ name }}</strong>.<h1>{{ html }}</h1>'
};

var email;
describe('email', () => {
  before(function() {
    email = new Email(stubTransport(), templates);
  });

  it('# gets sent', function(done) {
    var context = { name: 'doge', html: 'such email' };
    email.sendEmail({ to: 'joe@bloggs.com' }, context, function(err, info) {
      expect(err).not.to.be.ok;
      return done();
    });
  });

  it('# templating works', function(done) {
    var context = { name: 'doge', html: 'such email' };
    email.sendEmail({ to: 'joe@bloggs.com' }, context, function(err, info) {
      expect(info.response.toString()).to.contain('such email');
      return done();
    });
  });
});
