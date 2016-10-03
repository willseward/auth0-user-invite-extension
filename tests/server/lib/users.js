import { expect } from 'chai';
import { defaultConfig } from '../utils/dummyData';

var logger = require('../../../server/lib/logger');
var users = require('../../../server/lib/users');
var config = require('../../../server/lib/config');

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

    config.setProvider((key) => defaultConfig[key], null);
  });

  describe('getUsers', function () {
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

  describe('createUser', function () {

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

  describe('validateUserToken', function () {
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

    it('exits early if the email address is already verified', function (done) {
      let getRequest = nock('https://user-invite-extension.auth0.com:443', {"encodedQueryParams":true})
        .get('/api/v2/users')
        .query({"search_engine":"v2","fields":"user_id%2Cemail%2Cemail_verified%2Capp_metadata","include_totals":"false","q":"app_metadata.invite.token%3Ac207aece-b4d3-492e-9d35-276a71b77867","sort":"last_login%3A-1"})
        .reply(200, [{ user_id: 'auth0|57b7173d3fa4e89a29e9e2db', email_verified: true }]);
      let patchRequest = nock('https://user-invite-extension.auth0.com:443', {"encodedQueryParams":true})
        .patch(/^\/api\/v2\/users\/auth0%7C[0-9a-z]{24}$/, { email_verified: true })
        .reply(200);
      let options = {
        auth0: auth0,
        token: 'c207aece-b4d3-492e-9d35-276a71b77867'
      };
      users.validateUserToken(options, function (err, result) {
        expect(getRequest.isDone()).to.be.true;
        expect(patchRequest.isDone()).to.be.false;
        expect(err).not.to.be.ok;
        nock.cleanAll();
        return done();
      });
    });

    it('errors cleanly on a 4xx from the the API get request', function (done) {
      let getRequest = nock('https://user-invite-extension.auth0.com:443', {"encodedQueryParams":true})
        .get('/api/v2/users')
        .query({"search_engine":"v2","fields":"user_id%2Cemail%2Cemail_verified%2Capp_metadata","include_totals":"false","q":"app_metadata.invite.token%3Ac207aece-b4d3-492e-9d35-276a71b77867","sort":"last_login%3A-1"})
        .reply(400, [{ user_id: 'auth0|57b7173d3fa4e89a29e9e2db'}]);
      let options = {
        auth0: auth0,
        token: 'c207aece-b4d3-492e-9d35-276a71b77867'
      };
      users.validateUserToken(options, function (err, result) {
        expect(err).to.be.ok;
        return done();
      });
    });

    it('errors cleanly on a 5xx from the the API get request', function (done) {
      let getRequest = nock('https://user-invite-extension.auth0.com:443', {"encodedQueryParams":true})
        .get('/api/v2/users')
        .query({"search_engine":"v2","fields":"user_id%2Cemail%2Cemail_verified%2Capp_metadata","include_totals":"false","q":"app_metadata.invite.token%3Ac207aece-b4d3-492e-9d35-276a71b77867","sort":"last_login%3A-1"})
        .reply(500, [{ user_id: 'auth0|57b7173d3fa4e89a29e9e2db'}]);
      let options = {
        auth0: auth0,
        token: 'c207aece-b4d3-492e-9d35-276a71b77867'
      };
      users.validateUserToken(options, function (err, result) {
        expect(err).to.be.ok;
        return done();
      });
    });

    it('errors cleanly on a 4xx from the the API patch request', function (done) {
      let getRequest = nock('https://user-invite-extension.auth0.com:443', {"encodedQueryParams":true})
        .get('/api/v2/users')
        .query({"search_engine":"v2","fields":"user_id%2Cemail%2Cemail_verified%2Capp_metadata","include_totals":"false","q":"app_metadata.invite.token%3Ac207aece-b4d3-492e-9d35-276a71b77867","sort":"last_login%3A-1"})
        .reply(200, [{ user_id: 'auth0|57b7173d3fa4e89a29e9e2db'}]);
      let patchRequest = nock('https://user-invite-extension.auth0.com:443', {"encodedQueryParams":true})
        .patch(/^\/api\/v2\/users\/auth0%7C[0-9a-z]{24}$/, { email_verified: true })
        .reply(400);
      let options = {
        auth0: auth0,
        token: 'c207aece-b4d3-492e-9d35-276a71b77867'
      };
      users.validateUserToken(options, function (err, result) {
        expect(err).to.be.ok;
        return done();
      });
    });

    it('errors cleanly on a 5xx from the the API patch request', function (done) {
      let getRequest = nock('https://user-invite-extension.auth0.com:443', {"encodedQueryParams":true})
        .get('/api/v2/users')
        .query({"search_engine":"v2","fields":"user_id%2Cemail%2Cemail_verified%2Capp_metadata","include_totals":"false","q":"app_metadata.invite.token%3Ac207aece-b4d3-492e-9d35-276a71b77867","sort":"last_login%3A-1"})
        .reply(200, [{ user_id: 'auth0|57b7173d3fa4e89a29e9e2db'}]);
      let patchRequest = nock('https://user-invite-extension.auth0.com:443', {"encodedQueryParams":true})
        .patch(/^\/api\/v2\/users\/auth0%7C[0-9a-z]{24}$/, { email_verified: true })
        .reply(500);
      let options = {
        auth0: auth0,
        token: 'c207aece-b4d3-492e-9d35-276a71b77867'
      };
      users.validateUserToken(options, function (err, result) {
        expect(err).to.be.ok;
        return done();
      });
    });
  });

  describe('savePassword', function () {
    it('calls the auth0 v2 api users endpoint', function (done) {
      let id = 'auth0|57b7173d3fa4e89a29e9e2db';
      let getRequest = nock('https://user-invite-extension.auth0.com:443', {"encodedQueryParams":true})
        .get('/api/v2/users')
        .query({"search_engine":"v2","fields":"user_id%2Cemail%2Cemail_verified%2Capp_metadata","include_totals":"false","q":"app_metadata.invite.token%3Ac207aece-b4d3-492e-9d35-276a71b77867","sort":"last_login%3A-1"})
        .reply(200, [{ user_id: id }]);
      let patchBody = {
        password: 'wow',
        app_metadata: {
          invite: {
            status: 'accepted'
          }
        }
      };
      let patchRequest = nock('https://user-invite-extension.auth0.com:443', {"encodedQueryParams":true})
        .patch(/^\/api\/v2\/users\/auth0%7C[0-9a-z]{24}$/, patchBody)
        .reply(200);
      let options = {
        auth0: auth0,
        id: id,
        password: 'wow',
        token: 'c207aece-b4d3-492e-9d35-276a71b77867'
      };
      users.savePassword(options, function (err, result) {
        expect(getRequest.isDone()).to.be.true;
        expect(patchRequest.isDone()).to.be.true;
        expect(err).not.to.be.ok;
        return done();
      });
    });
  });
});
