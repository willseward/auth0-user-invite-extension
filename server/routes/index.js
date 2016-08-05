import { Router as router } from 'express';

import html from './html';
import meta from './meta';
import hooks from './hooks';

import config from '../lib/config';
import invitations from '../lib/invitations';
import { readStorage } from '../lib/storage';
import { dashboardAdmins, requireUser } from '../lib/middlewares';

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

  routes.get('/api/config', requireUser, (req, res) => {
    res.json({
      secret: config('EXTENSION_SECRET'),
      branch: config('GITHUB_BRANCH'),
      repository: getRepository()
    });
  });

  routes.post('/api/invitations', /*requireUser, */(req, res, next) => {
    console.log(">>> inviteUsers // BODY ", req.body)

    if (req.is(['application/csv', 'text/csv'])) {
      invitations.inviteUsers(req.body, (err, result) => {
      });
    } else if (req.is('application/json')) {
      invitations.inviteUser(req.body, (err, result) => {
      });
    } else {
      res.sendStatus(400);
    }
  });

  routes.get('/api/invitations', /*requireUser, */(req, res, next) => {
    invitations.getInvitations({ filter: req.query.filter }, (err, result) => {
      if (err || !result) {
        res.status(500).send({ error: err, filter: req.query.filter });
      }

      res.send({
        result,
        filter: req.query.filter
      });
    });
  });

  return routes;
};
