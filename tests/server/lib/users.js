import { expect } from 'chai';

var logger = require('../../../server/lib/logger');
var users = require('../../../server/lib/users');

var nock = require('nock');
var stubTransport = require('nodemailer-stub-transport');
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
    users.configureEmail(stubTransport(), {})
    logger.transports.console.level = 'error';
  });

  describe('getUsers', function (done) {
    it('calls the auth0 v2 api users endpoint', function (done) {
      let request = nock('https://user-invite-extension.auth0.com:443', {"encodedQueryParams":true})
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
        expect(request.isDone()).to.be.true;
        return done();
      });
    });

    it('handles the case where there are no users', function (done) {
      let request = nock('https://user-invite-extension.auth0.com:443', {"encodedQueryParams":true})
        .get('/api/v2/users')
        .query({"sort":"last_login%3A-1","q":"app_metadata.invite.status%3Apending","per_page":"100","page":"0","include_totals":"true","fields":"user_id%2Cname%2Cemail%2Capp_metadata","search_engine":"v2"})
        .reply(200, { start: 0, limit: 100, length: 0, users: [], total: 0 });
      let options = {
        auth0: auth0,
        filter: 'pending',
        perPage: 100,
        page: 0
      };
      users.getUsers(options, function (err, result) {
        expect(err).to.not.be.ok;
        return done();
      });
    });

    it('returns an error object when a bad request is made', function (done) {
      let request = nock('https://user-invite-extension.auth0.com:443', {"encodedQueryParams":true})
        .get('/api/v2/users')
        .query({"sort":"last_login%3A-1","q":"app_metadata.invite.status%3Apending","per_page":"100","page":"0","include_totals":"true","fields":"user_id%2Cname%2Cemail%2Capp_metadata","search_engine":"v2"})
        .reply(400);
      let options = {
        auth0: auth0,
        filter: 'pending',
        perPage: 100,
        page: 0
      };
      users.getUsers(options, function (err, result) {
        expect(err).to.be.ok;
        return done();
      });
    });

    it('returns an error object when an error comes back from the API', function (done) {
      let request = nock('https://user-invite-extension.auth0.com:443', {"encodedQueryParams":true})
        .get('/api/v2/users')
        .query({"sort":"last_login%3A-1","q":"app_metadata.invite.status%3Apending","per_page":"100","page":"0","include_totals":"true","fields":"user_id%2Cname%2Cemail%2Capp_metadata","search_engine":"v2"})
        .reply(500);
      let options = {
        auth0: auth0,
        filter: 'pending',
        perPage: 100,
        page: 0
      };
      users.getUsers(options, function (err, result) {
        expect(err).to.be.ok;
        return done();
      });
    });
  });

  describe('createUser', function (done) {
    it('calls the auth0 v2 api users endpoint', function (done) {
      let request = nock('https://user-invite-extension.auth0.com:443', {"encodedQueryParams":true})
        .post('/api/v2/users')
        .reply(201);
      let options = {
        auth0: auth0,
        connection: 'Username-Password-Authentication',
        email: 'joe@bloggs.com',
        host: 'user-invite-extension.auth0.com'
      };
      users.createUser(options, function (err, result) {
        expect(request.isDone()).to.be.true;
        return done();
      });
    });

    it('handles the case where a user already exists', function (done) {
      let request = nock('https://user-invite-extension.auth0.com:443', {"encodedQueryParams":true})
        .post('/api/v2/users')
        .reply(404);
      let options = {
        auth0: auth0,
        connection: 'Username-Password-Authentication',
        email: 'joe@bloggs.com',
        host: 'user-invite-extension.auth0.com'
      };
      users.createUser(options, function (err, result) {
        expect(err).to.be.ok;
        return done();
      });
    });

    it('handles the case a bad request', function (done) {
      let request = nock('https://user-invite-extension.auth0.com:443', {"encodedQueryParams":true})
        .post('/api/v2/users')
        .reply(400);
      let options = {
        auth0: auth0,
        connection: 'Username-Password-Authentication',
        email: 'joe@bloggs.com',
        host: 'user-invite-extension.auth0.com'
      };
      users.createUser(options, function (err, result) {
        expect(err).to.be.ok;
        return done();
      });
    });
  });

  describe('validateUserToken', function (done) {
    it('calls the auth0 v2 api users endpoint', function (done) {
      let getRequest = nock('https://user-invite-extension.auth0.com:443', {"encodedQueryParams":true})
        .get('/api/v2/users')
        .query({"search_engine":"v2","fields":"user_id%2Cemail%2Cemail_verified%2Capp_metadata","include_totals":"false","q":"app_metadata.invite.token%3Ac207aece-b4d3-492e-9d35-276a71b77867","sort":"last_login%3A-1"})
        .reply(200, [{ user_id: 'auth0|57b7173d3fa4e89a29e9e2db'}]);
      let patchRequest = nock('https://user-invite-extension.auth0.com:443', {"encodedQueryParams":true})
        .patch(/^\/api\/v2\/users\/auth0%7C[0-9a-z]{24}$/, { email_verified: true })
        .reply(200);
      let options = {
        auth0: auth0,
        token: 'c207aece-b4d3-492e-9d35-276a71b77867'
      };
      users.validateUserToken(options, function (err, result) {
        expect(getRequest.isDone()).to.be.true;
        expect(patchRequest.isDone()).to.be.true;
        return done();
      });
    });

    it.skip('short-circuits the verification if the email address is verified', function (done) {
      // user.email_verified
    });
  });

  describe.skip('savePassword', function (done) {
  });

  describe.skip('configureEmail', function (done) {
  });
});
