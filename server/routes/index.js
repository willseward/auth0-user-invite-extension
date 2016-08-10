import { Router as router } from 'express';

import html from './html';
import meta from './meta';
import hooks from './hooks';

import config from '../lib/config';
import { readStorage } from '../lib/storage';
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
  routes.get('/configuration', html());
  routes.use('/meta', meta());

  routes.use(managementClient);

  routes.get('/api/config', requireUser, (req, res) => {
    readStorage(storageContext).then(data => { res.json(data) });
  });

  routes.patch('/api/config', requireUser, (req, res) => {
    writeStorage(storageContext, req.body).then(res.sendStatus(200));
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

  return routes;
};
