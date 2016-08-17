var path = require('path');
var url = require('url');

module.exports = function getChangePasswordPath(env, host, token) {
  return url.format({
    protocol: env !== 'production' ? 'http' : 'https',
    host: host,
    pathname: path.join('changepassword', token)
  });
};
