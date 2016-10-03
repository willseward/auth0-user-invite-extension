import { Router as router } from 'express';
import stubTransport from 'nodemailer-stub-transport';
import { middlewares } from 'auth0-extension-express-tools';

import changePassword from '../views/changePassword';
import html from './html';
import hooks from './hooks';
import meta from './meta';

import config from '../lib/config';
import users from '../lib/users';
import validations from '../lib/validations';

import { dashboardAdmins } from '../lib/middlewares';

import { readStorage, writeTemplateConfig, readConfigStatus } from '../lib/storage';

import connectionsHandlers from './connections';
import userHandlers from './users';

const configureEmail = (smtpConfig, templateConfig) => {
  if (!smtpConfig || Object.keys(smtpConfig).length == 0 || !smtpConfig.host) {
    smtpConfig = stubTransport();
  }
  users.configureEmail(smtpConfig, templateConfig);
};

export default (storageContext) => {
  const smtpConfig = {
    host: config('SMTP_HOST'),
    port: config('SMTP_PORT'),
    secure: config('SMTP_SECURE'),
    auth: {
      user: config('SMTP_AUTH_USER'),
      pass: config('SMTP_AUTH_PASS')
    }
  };
  readStorage(storageContext).then(data => {
    configureEmail(smtpConfig, data.templateConfig);
  });

  const routes = router();
  routes.use('/.extensions', hooks());
  routes.use('/', dashboardAdmins());

  // specific client routes
  routes.get('/', html());
  routes.get('/configuration', html());
  routes.get('/changepassword/*', changePassword());

  routes.use('/meta', meta());

  const managementApiClient = middlewares.managementApiClient({
    domain: config('AUTH0_DOMAIN'),
    clientId: config('AUTH0_CLIENT_ID'),
    clientSecret: config('AUTH0_CLIENT_SECRET')
  });
  routes.use(managementApiClient);

  routes.get('/api/config/template', middlewares.requireUser,
    (req, res, next) => {
      readStorage(storageContext)
        .then(data => { res.json({ result: data.templateConfig } || {}); })
        .catch(next);
    });

  routes.patch('/api/config/template',
    middlewares.requireUser,
    validations.validateWriteTemplateConfig,
    (req, res, next) => {
      writeTemplateConfig(storageContext, req.body)
        .then((data) => {
          configureEmail(smtpConfig, data.templateConfig);
          res.sendStatus(200);
        })
        .catch(next);
    });

  routes.get('/api/config/status',
    middlewares.requireUser,
    (req, res, next) => {
      readConfigStatus(storageContext)
        .then((status) => {
          res.json({ result: status });
        })
        .catch(next);
    });

  routes.use('/api/connections',
    middlewares.requireUser,
    connectionsHandlers.getConnectionsHandler);

  routes.post('/api/invitations/user',
    middlewares.requireUser,
    validations.validateInviteUser,
    userHandlers.createUserHandler);

  routes.get('/api/invitations',
    middlewares.requireUser,
    validations.validateInvitations,
    userHandlers.getUsersHandler);

  routes.put('/api/changepassword',
    validations.validateUserToken,
    userHandlers.validateUserTokenHandler);

  routes.post('/api/changepassword',
    validations.validateSavePassword,
    userHandlers.savePasswordHandler);

  return routes;
};
