import { expect } from 'chai';

var users = require('../../../server/lib/users');
var nock = require('nock');
var ManagementClient = require('auth0').ManagementClient;
var auth0;

// Note this is arbitrary, it's mocked in the tests
const AUTH0_DOMAIN = 'user-invite-extension.auth0.com';
const AUTH0_TOKEN = 'placeholder';
const API_URL = `https://$(AUTH0_DOMAIN}.auth0.com`;

describe('users', function () {
  before(function () {
    auth0 = new ManagementClient({
      token: AUTH0_TOKEN,
      domain: AUTH0_DOMAIN
    });
  });

  describe('getUsers', function (done) {
    it('does something', function (done) {
      var request = nock(API_URL, { encodedQueryParams: true })
        .get('/api/v2/users')
        .query({"sort":"last_login%3A-1","q":"app_metadata.invite.status%3Apending","per_page":"100","page":"0","include_totals":"true","fields":"user_id%2Cname%2Cemail%2Capp_metadata","search_engine":"v2"})
        .reply(200);

      let options = {
        auth0: auth0,
        filter: 'pending',
        perPage: 100,
        page: 0
      };
      users.getUsers(options, function (err, result) {
        console.log('err', err);
        console.log('result', result);
        expect(request.isDone()).to.be.true;
        //expect(err).not.to.be.ok;
        return done();
      });
    });
  });

  describe.skip('createUser', function (done) {
  });

  describe.skip('updateEmailVerified', function (done) {
  });

  describe.skip('validateToken', function (done) {
  });

  describe.skip('validateUserToken', function (done) {
  });

  describe.skip('savePassword', function (done) {
  });

  describe.skip('configureEmail', function (done) {
  });
});
