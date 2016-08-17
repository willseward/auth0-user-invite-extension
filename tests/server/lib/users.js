import { expect } from 'chai';

var users = require('../../../server/lib/users');
var nock = require('nock');
var ManagementClient = require('auth0').ManagementClient;
var auth0;

// Note this is arbitrary, it's mocked in the tests
const AUTH0_DOMAIN = 'user-invite-extension.auth0.com';
const AUTH0_TOKEN = 'placeholder';
const API_URL = `https://${AUTH0_DOMAIN}.auth0.com`;

describe('users', function () {
  before(function () {
    auth0 = new ManagementClient({
      token: AUTH0_TOKEN,
      domain: AUTH0_DOMAIN
    });
  });

  describe('getUsers', function (done) {
    it('does something', function (done) {
      var request = nock('https://user-invite-extension.auth0.com:443', {"encodedQueryParams":true})
        .get('/api/v2/users')
        .query({"sort":"last_login%3A-1","q":"app_metadata.invite.status%3Apending","per_page":"100","page":"0","include_totals":"true","fields":"user_id%2Cname%2Cemail%2Capp_metadata","search_engine":"v2"})
        .reply(200, ["1f8b08000000000000031d8ec10e82301044ff65cf60baad6d9593ff618c69edaa8d50082c2606f977176f6f2633995960e2303234aa8236775908d5c6541efc1451c13cd13841735efe74cd091a08333fd5d7fa68f6ee7870680e88d139434a69f250017521b7126ce7179d3e6ddae55edc300cd78e38a4c0019a05727967a68de405cfb202039594cb43c2dcbfa888a36c4474ded4f17ef7f5deba541f755235c51b598c9aac4658d7f5b25538c82aae3ff8b66f60d7000000"], { date: 'Wed, 17 Aug 2016 15:10:19 GMT',
        'content-type': 'application/json; charset=utf-8',
        'transfer-encoding': 'chunked',
        connection: 'close',
        'x-ratelimit-limit': '50',
        'x-ratelimit-remaining': '48',
        'x-ratelimit-reset': '1471446620',
        vary: 'origin,accept-encoding',
        'cache-control': 'no-cache',
        'content-encoding': 'gzip',
        'strict-transport-security': 'max-age=15724800',
        'x-robots-tag': 'noindex, nofollow, nosnippet, noarchive' });

      let options = {
        auth0: auth0,
        filter: 'pending',
        perPage: 100,
        page: 0
      };
      users.getUsers(options, function (err, result) {
        expect(request.isDone()).to.be.true;
        expect(err).not.to.be.ok;
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
