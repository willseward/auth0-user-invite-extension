import _ from 'lodash';

/*
 * List all connections.
 */
function getConnections(options, callback) {

  options.auth0.connections
    .getAll({ fields: 'name', 'strategy': 'auth0' })
    .then(connections => _.chain(connections)
      .sortBy((conn) => conn.name.toLowerCase())
      .value())
    .then(connections => _.map(connections, 'name'))
    .then(connections => callback(null, connections))
    .catch(callback);
}

module.exports = {
  getConnections: getConnections
};
