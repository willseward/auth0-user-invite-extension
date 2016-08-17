import _ from 'lodash';
import { Router as router } from 'express';

/*
 * List all connections.
 */
function getConnectionsHandler(req, res, next) {
  let options = {
    auth0: req.auth0
  };
  connections.getConnections(options, function onGetConnections(err, result) {
    if (err) {
      return next(err);
    }
    return res.json(result);
  });
}

module.exports = {
  getConnectionsHandler: getConnectionsHandler
};
