import { Router as router } from 'express';
import stubTransport from 'nodemailer-stub-transport';

import changePassword from '../views/changePassword';
import html from './html';
import hooks from './hooks';
import meta from './meta';

import config from '../lib/config';
import logger from '../lib/logger';
import users from '../lib/users';
import validations from '../lib/validations';

import { dashboardAdmins, requireUser, managementClient } from '../lib/middlewares';
import { readStorage, writeTemplateConfig, readConfigStatus } from '../lib/storage';

import connectionsHandlers from './connections';
import userHandlers from './users';

const configureEmail = (smtpConfig, templateConfig) => {
  if (!smtpConfig || Object.keys(smtpConfig).length == 0 || !smtpConfig.host) {
    smtpConfig = stubTransport();
  }
  users.configureEmail(smtpConfig, templateConfig)
};

export default (storageContext) => {
  let smtpConfig = {
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

  routes.use(managementClient);

  routes.get('/api/config/template', requireUser, (req, res) => {
    readStorage(storageContext)
    .then(data => { res.json(data.templateConfig || {}) });
  });

  routes.patch('/api/config/template',
    requireUser,
    validations.validateWriteTemplateConfig,
    (req, res) => {
      writeTemplateConfig(storageContext, req.body).then((data) => {
        configureEmail(smtpConfig, data.templateConfig);
        res.sendStatus(200);
      });
    });

  routes.get('/api/config/status',
    requireUser,
    (req, res) => {
      readConfigStatus(storageContext).then((status) => {
        res.json(status);
      });
  });

  routes.use('/api/connections',
    requireUser,
    connectionsHandlers.getConnectionsHandler);

  routes.post('/api/invitations/user',
    requireUser,
    validations.validateInviteUser,
    userHandlers.createUserHandler);

  routes.get('/api/invitations',
    requireUser,
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
