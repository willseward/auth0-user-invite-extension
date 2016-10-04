import { expect } from 'chai';
import { defaultConfig } from '../utils/dummyData';

const logger = require('../../../server/lib/logger');
const users = require('../../../server/lib/users');
const config = require('../../../server/lib/config');

const nock = require('nock');
const stubTransport = require('nodemailer-stub-transport');
const ManagementClient = require('auth0').ManagementClient;

let auth0;

// Note this is arbitrary, it's mocked in the tests
const AUTH0_DOMAIN = 'user-invite-extension.auth0.com';
const AUTH0_TOKEN = 'placeholder';
const API_URL = `https://${AUTH0_DOMAIN}.auth0.com`;

describe('users', () => {
  before(() => {
    auth0 = new ManagementClient({
      token: AUTH0_TOKEN,
      domain: AUTH0_DOMAIN
    });
    users.configureEmail(stubTransport(), {});
    logger.transports.console.level = 'error';

    config.setProvider((key) => defaultConfig[key], null);
  });

  describe('getUsers', () => {
    it('calls the auth0 v2 api users endpoint', (done) => {
      const request = nock('https://user-invite-extension.auth0.com:443', { encodedQueryParams: true })
        .get('/api/v2/users')
        .query({ "sort":"last_login%3A-1","q":"app_metadata.invite.status%3Apending","per_page":"100","page":"0","include_totals":"true","fields":"user_id%2Cname%2Cemail%2Capp_metadata","search_engine":"v2" })
        .reply(200);
      const options = {
        auth0,
        filter: 'pending',
        perPage: 100,
        page: 0
      };
      users.getUsers(options, (err, result) => {
        expect(request.isDone()).to.be.true;
        return done();
      });
    });

    it('handles the case where there are no users', (done) => {
      const request = nock('https://user-invite-extension.auth0.com:443', { encodedQueryParams: true })
        .get('/api/v2/users')
        .query({ "sort":"last_login%3A-1","q":"app_metadata.invite.status%3Apending","per_page":"100","page":"0","include_totals":"true","fields":"user_id%2Cname%2Cemail%2Capp_metadata","search_engine":"v2" })
        .reply(200, { start: 0, limit: 100, length: 0, users: [], total: 0 });
      const options = {
        auth0,
        filter: 'pending',
        perPage: 100,
        page: 0
      };
      users.getUsers(options, (err, result) => {
        expect(err).to.not.be.ok;
        return done();
      });
    });

    it('returns an error object when a bad request is made', (done) => {
      const request = nock('https://user-invite-extension.auth0.com:443', { encodedQueryParams: true })
        .get('/api/v2/users')
        .query({ "sort":"last_login%3A-1","q":"app_metadata.invite.status%3Apending","per_page":"100","page":"0","include_totals":"true","fields":"user_id%2Cname%2Cemail%2Capp_metadata","search_engine":"v2" })
        .reply(400);
      const options = {
        auth0,
        filter: 'pending',
        perPage: 100,
        page: 0
      };
      users.getUsers(options, (err, result) => {
        expect(err).to.be.ok;
        return done();
      });
    });

    it('returns an error object when an error comes back from the API', (done) => {
      const request = nock('https://user-invite-extension.auth0.com:443', { encodedQueryParams: true })
        .get('/api/v2/users')
        .query({ "sort":"last_login%3A-1","q":"app_metadata.invite.status%3Apending","per_page":"100","page":"0","include_totals":"true","fields":"user_id%2Cname%2Cemail%2Capp_metadata","search_engine":"v2" })
        .reply(500);
      const options = {
        auth0,
        filter: 'pending',
        perPage: 100,
        page: 0
      };
      users.getUsers(options, (err, result) => {
        expect(err).to.be.ok;
        return done();
      });
    });
  });

  describe('createUser', () => {
    it('calls the auth0 v2 api users endpoint', (done) => {
      const request = nock('https://user-invite-extension.auth0.com:443', { encodedQueryParams: true })
        .post('/api/v2/users')
        .reply(201);
      const options = {
        auth0,
        connection: 'Username-Password-Authentication',
        email: 'joe@bloggs.com',
        host: 'user-invite-extension.auth0.com'
      };
      users.createUser(options, (err, result) => {
        expect(request.isDone()).to.be.true;
        return done();
      });
    });

    it('handles the case where a user already exists', (done) => {
      const request = nock('https://user-invite-extension.auth0.com:443', { encodedQueryParams: true })
        .post('/api/v2/users')
        .reply(404);
      const options = {
        auth0,
        connection: 'Username-Password-Authentication',
        email: 'joe@bloggs.com',
        host: 'user-invite-extension.auth0.com'
      };
      users.createUser(options, (err, result) => {
        expect(err).to.be.ok;
        return done();
      });
    });

    it('handles the case a bad request', (done) => {
      const request = nock('https://user-invite-extension.auth0.com:443', { encodedQueryParams: true })
        .post('/api/v2/users')
        .reply(400);
      const options = {
        auth0,
        connection: 'Username-Password-Authentication',
        email: 'joe@bloggs.com',
        host: 'user-invite-extension.auth0.com'
      };
      users.createUser(options, (err, result) => {
        expect(err).to.be.ok;
        return done();
      });
    });
  });

  describe('validateUserToken', () => {
    it('calls the auth0 v2 api users endpoint', (done) => {
      const getRequest = nock('https://user-invite-extension.auth0.com:443', { encodedQueryParams: true })
        .get('/api/v2/users')
        .query({
          search_engine: 'v2',
          fields: 'user_id%2Cemail%2Cemail_verified%2Capp_metadata',
          include_totals: 'false',
          q: 'app_metadata.invite.token%3Ac207aece-b4d3-492e-9d35-276a71b77867',
          sort: 'last_login%3A-1'
        })
        .reply(200, [ { user_id: 'auth0|57b7173d3fa4e89a29e9e2db' } ]);
      const patchRequest = nock('https://user-invite-extension.auth0.com:443', { encodedQueryParams: true })
        .patch(/^\/api\/v2\/users\/auth0%7C[0-9a-z]{24}$/, { email_verified: true })
        .reply(200);
      const options = {
        auth0,
        token: 'c207aece-b4d3-492e-9d35-276a71b77867'
      };
      users.validateUserToken(options, (err, result) => {
        expect(getRequest.isDone()).to.be.true;
        expect(patchRequest.isDone()).to.be.true;
        return done();
      });
    });

    it('exits early if the email address is already verified', (done) => {
      const getRequest = nock('https://user-invite-extension.auth0.com:443', { encodedQueryParams: true })
        .get('/api/v2/users')
        .query({
          search_engine: 'v2',
          fields: 'user_id%2Cemail%2Cemail_verified%2Capp_metadata',
          include_totals: 'false',
          q: 'app_metadata.invite.token%3Ac207aece-b4d3-492e-9d35-276a71b77867',
          sort: 'last_login%3A-1'
        })
        .reply(200, [{ user_id: 'auth0|57b7173d3fa4e89a29e9e2db', email_verified: true }]);
      const patchRequest = nock('https://user-invite-extension.auth0.com:443', { encodedQueryParams: true })
        .patch(/^\/api\/v2\/users\/auth0%7C[0-9a-z]{24}$/, { email_verified: true })
        .reply(200);
      const options = {
        auth0,
        token: 'c207aece-b4d3-492e-9d35-276a71b77867'
      };
      users.validateUserToken(options, (err, result) => {
        expect(getRequest.isDone()).to.be.true;
        expect(patchRequest.isDone()).to.be.false;
        expect(err).not.to.be.ok;
        nock.cleanAll();
        return done();
      });
    });

    it('errors cleanly on a 4xx from the the API get request', (done) => {
      const getRequest = nock('https://user-invite-extension.auth0.com:443', { encodedQueryParams: true })
        .get('/api/v2/users')
        .query({
          search_engine: 'v2',
          fields: 'user_id%2Cemail%2Cemail_verified%2Capp_metadata',
          include_totals: 'false',
          q: 'app_metadata.invite.token%3Ac207aece-b4d3-492e-9d35-276a71b77867',
          sort: 'last_login%3A-1'
        })
        .reply(400, [ { user_id: 'auth0|57b7173d3fa4e89a29e9e2db' } ]);
      const options = {
        auth0,
        token: 'c207aece-b4d3-492e-9d35-276a71b77867'
      };
      users.validateUserToken(options, (err, result) => {
        expect(err).to.be.ok;
        return done();
      });
    });

    it('errors cleanly on a 5xx from the the API get request', (done) => {
      const getRequest = nock('https://user-invite-extension.auth0.com:443', { encodedQueryParams: true })
        .get('/api/v2/users')
        .query({
          search_engine: 'v2',
          fields: 'user_id%2Cemail%2Cemail_verified%2Capp_metadata',
          include_totals: 'false',
          q: 'app_metadata.invite.token%3Ac207aece-b4d3-492e-9d35-276a71b77867',
          sort: 'last_login%3A-1'
        })
        .reply(500, [ { user_id: 'auth0|57b7173d3fa4e89a29e9e2db' } ]);
      const options = {
        auth0,
        token: 'c207aece-b4d3-492e-9d35-276a71b77867'
      };
      users.validateUserToken(options, (err, result) => {
        expect(err).to.be.ok;
        return done();
      });
    });

    it('errors cleanly on a 4xx from the the API patch request', (done) => {
      const getRequest = nock('https://user-invite-extension.auth0.com:443', { encodedQueryParams: true })
        .get('/api/v2/users')
        .query({
          search_engine: 'v2',
          fields: 'user_id%2Cemail%2Cemail_verified%2Capp_metadata',
          include_totals: 'false',
          q: 'app_metadata.invite.token%3Ac207aece-b4d3-492e-9d35-276a71b77867',
          sort: 'last_login%3A-1'
        })
        .reply(200, [ { user_id: 'auth0|57b7173d3fa4e89a29e9e2db' } ]);
      const patchRequest = nock('https://user-invite-extension.auth0.com:443', { encodedQueryParams: true })
        .patch(/^\/api\/v2\/users\/auth0%7C[0-9a-z]{24}$/, { email_verified: true })
        .reply(400);
      const options = {
        auth0,
        token: 'c207aece-b4d3-492e-9d35-276a71b77867'
      };
      users.validateUserToken(options, (err, result) => {
        expect(err).to.be.ok;
        return done();
      });
    });

    it('errors cleanly on a 5xx from the the API patch request', (done) => {
      const getRequest = nock('https://user-invite-extension.auth0.com:443', { encodedQueryParams: true })
        .get('/api/v2/users')
        .query({
          search_engine: 'v2',
          fields: 'user_id%2Cemail%2Cemail_verified%2Capp_metadata',
          include_totals: 'false',
          q: 'app_metadata.invite.token%3Ac207aece-b4d3-492e-9d35-276a71b77867',
          sort: 'last_login%3A-1'
        })
        .reply(200, [ { user_id: 'auth0|57b7173d3fa4e89a29e9e2db' } ]);
      const patchRequest = nock('https://user-invite-extension.auth0.com:443', { encodedQueryParams: true })
        .patch(/^\/api\/v2\/users\/auth0%7C[0-9a-z]{24}$/, { email_verified: true })
        .reply(500);
      const options = {
        auth0,
        token: 'c207aece-b4d3-492e-9d35-276a71b77867'
      };
      users.validateUserToken(options, (err, result) => {
        expect(err).to.be.ok;
        return done();
      });
    });
  });

  describe('savePassword', () => {
    it('calls the auth0 v2 api users endpoint', (done) => {
      const id = 'auth0|57b7173d3fa4e89a29e9e2db';
      const getRequest = nock('https://user-invite-extension.auth0.com:443', { encodedQueryParams: true })
        .get('/api/v2/users')
        .query({
          search_engine: 'v2',
          fields: 'user_id%2Cemail%2Cemail_verified%2Capp_metadata',
          include_totals: 'false',
          q: 'app_metadata.invite.token%3Ac207aece-b4d3-492e-9d35-276a71b77867',
          sort: 'last_login%3A-1'
        })
        .reply(200, [ { user_id: id } ]);
      const patchBody = {
        password: 'wow',
        app_metadata: {
          invite: {
            status: 'accepted'
          }
        }
      };
      const patchRequest = nock('https://user-invite-extension.auth0.com:443', { encodedQueryParams: true })
        .patch(/^\/api\/v2\/users\/auth0%7C[0-9a-z]{24}$/, patchBody)
        .reply(200);
      const options = {
        auth0,
        id,
        password: 'wow',
        token: 'c207aece-b4d3-492e-9d35-276a71b77867'
      };
      users.savePassword(options, (err, result) => {
        expect(getRequest.isDone()).to.be.true;
        expect(patchRequest.isDone()).to.be.true;
        expect(err).not.to.be.ok;
        return done();
      });
    });
  });
});
