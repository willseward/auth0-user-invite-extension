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
import { readStorage, writeTemplateConfig, writeSMTPConfig } from '../lib/storage';

import connectionsHandlers from './connections';
import userHandlers from './users';

const configureEmail = (data) => {
  let smtpConfig = data.smtpConfig;
  if (!smtpConfig || Object.keys(smtpConfig).length == 0) {
    smtpConfig = stubTransport();
  }
  users.configureEmail(smtpConfig, data.templateConfig)
};

export default (storageContext) => {
  readStorage(storageContext).then(data => {
    configureEmail(data);
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
        configureEmail(data);
        res.sendStatus(200);
      });
    });

  routes.get('/api/config/smtp', requireUser, (req, res) => {
    readStorage(storageContext)
    .then(data => { res.json(data.smtpConfig || {} ) });
  });

  routes.patch('/api/config/smtp',
    requireUser,
    validations.validateWriteSMTPConfig,
    (req, res) => {
      writeSMTPConfig(storageContext, req.body).then((data) => {
        configureEmail(data);
        res.sendStatus(200);
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
