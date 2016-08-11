import { Router as router } from 'express';

import html from './html';
import meta from './meta';
import hooks from './hooks';

import config from '../lib/config';
import { readStorage, writeTemplateConfig, writeSMTPConfig } from '../lib/storage';
import { dashboardAdmins, requireUser, managementClient } from '../lib/middlewares';
import invitations from '../lib/invitations';
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

export default (storageContext) => {
  const routes = router();
  routes.use('/.extensions', hooks());
  routes.use('/', dashboardAdmins());
  routes.get('/', html());

  // specific client routes
  routes.get('/configuration', html());
  routes.get('/changepassword/*', html());

  routes.use('/meta', meta());

  routes.use(managementClient);

  routes.get('/api/config/template', requireUser, (req, res) => {
    readStorage(storageContext).then(data => { res.json(data.templateConfig || {}) });
  });

  routes.patch('/api/config/template', requireUser, (req, res) => {
    writeTemplateConfig(storageContext, req.body).then(() => { res.sendStatus(200) });
  });

  routes.get('/api/config/smtp', requireUser, (req, res) => {
    readStorage(storageContext).then(data => { res.json(data.smtpConfig || {} ) });
  });

  routes.patch('/api/config/smtp', requireUser, (req, res) => {
    writeSMTPConfig(storageContext, req.body).then(res.sendStatus(200));
  });

  routes.use('/api/connections', requireUser, connections());

  routes.post('/api/invitations/user',
    requireUser,
    invitations.validateInviteUser,
    users.createUser());

  routes.get('/api/invitations',
    requireUser,
    invitations.validateInvitations,
    users.getUsers());

  routes.get('/api/changepassword',
  /* validate, */
    users.validateUserToken());

  routes.post('/api/changepassword',
  /* validate, */
    users.savePassword());

  return routes;
};
