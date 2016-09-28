import connections from '../lib/connections';

/*
 * List all connections.
 */
function getConnectionsHandler(req, res, next) {
  const options = {
    auth0: req.auth0
  };
  connections.getConnections(options, function onGetConnections(err, result) {
    if (err) {
      return res.status(err.statusCode || 500).send(err);
    }
    return res.json({ result });
  });
}

module.exports = {
  getConnectionsHandler
};
