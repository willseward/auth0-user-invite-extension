import { Router as router } from 'express';

import html from './html';
import meta from './meta';
import hooks from './hooks';

import config from '../lib/config';
import { readStorage } from '../lib/storage';
import { dashboardAdmins, requireUser, managementClient } from '../lib/middlewares';
import invitations from '../lib/invitations';

import connections from './connections';
import users from './users';

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
  routes.use('/meta', meta());

  routes.use(managementClient);

  routes.get('/api/config', requireUser, (req, res) => {
    res.json({
      secret: config('EXTENSION_SECRET'),
      branch: config('GITHUB_BRANCH'),
      repository: getRepository()
    });
  });

  routes.use('/api/connections', connections());

  routes.post('/api/invitations/user',
    invitations.validateInviteUser,
    users.createUser());

  routes.get('/api/invitations',
    invitations.validateInvitations,
    users.getUsers());

  return routes;
};
