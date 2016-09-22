import _ from 'lodash';

/*
 * List all connections.
 */
function getConnections(options, callback) {

  options.auth0.connections
    .getAll({ fields: 'name,options', 'strategy': 'auth0' })
    .then(connections => _.chain(connections)
      .sortBy((conn) => conn.name.toLowerCase())
      .value())
    .then(connections => _.map(connections, function(conn) {
      return {
        name: conn.name,
        requires_username: conn.options.requires_username ? conn.options.requires_username : false
      }
    }))
    .then(connections => callback(null, connections))
    .catch(callback);
}

module.exports = {
  getConnections: getConnections
};
