import { Router as router } from 'express';

import html from './html';
import changePassword from '../views/changePassword';
import meta from './meta';
import hooks from './hooks';

import config from '../lib/config';
import { readStorage, writeTemplateConfig, writeSMTPConfig } from '../lib/storage';
import { dashboardAdmins, requireUser, managementClient } from '../lib/middlewares';
import stubTransport from 'nodemailer-stub-transport';
import validations from '../lib/validations';
import users from '../lib/users';

import connections from './connections';

const getRepository = () => {
  const repo = config('GITHUB_REPOSITORY');

  const parts = repo.split('/');
  if (parts.length === 5) {
    const [ , , , account, repository ] = parts;
    return `${account}/${repository}`;
  }

  return repo;
};

const configureEmail = (data) => {
  let smtpConfig = data.smtpConfig;
  if (!smtpConfig || Object.keys(smtpConfig) == 0) {
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

  routes.use('/api/connections', requireUser, connections());

  routes.post('/api/invitations/user',
    requireUser,
    validations.validateInviteUser,
    users.createUser());

  routes.get('/api/invitations',
    requireUser,
    validations.validateInvitations,
    users.getUsers());

  routes.put('/api/changepassword',
    validations.validateUserToken,
    users.validateUserToken());

  routes.post('/api/changepassword',
    validations.validateSavePassword,
    users.savePassword());

  return routes;
};
