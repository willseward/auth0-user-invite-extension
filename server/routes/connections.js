import _ from 'lodash';
import { Router as router } from 'express';
import { managementClient } from '../lib/middlewares';

export default () => {
  const api = router();

  /*
   * List all connections.
   */
  api.get('/', managementClient, (req, res, next) => {
    req.auth0.connections
      .getAll({ fields: 'name', 'strategy': 'auth0' })
      .then(connections => _.chain(connections)
      .sortBy((conn) => conn.name.toLowerCase())
      .value())
      .then(connections => _.map(connections, 'name'))
      .then(connections => res.json(connections))
      .catch(next);
  });

  return api;
};
