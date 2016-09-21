import _ from 'lodash';
import { Router as router } from 'express';
import connections from '../lib/connections';

/*
 * List all connections.
 */
function getConnectionsHandler(req, res, next) {
  let options = {
    auth0: req.auth0
  };
  connections.getConnections(options, function onGetConnections(err, result) {
    // TODO verify
    if (err) {
      return (err.error && err.error.statusCode) ? res.status(err.error.statusCode).send(err) : res.status(500).send(err);
    }
    return res.json(result);
  });
}

module.exports = {
  getConnectionsHandler: getConnectionsHandler
};
