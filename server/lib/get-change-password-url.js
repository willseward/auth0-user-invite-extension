const path = require('path');
const url = require('url');

module.exports = function getChangePasswordPath(env, host, token) {
  return url.format({
    protocol: env !== 'production' ? 'http' : 'https',
    host,
    pathname: path.join('changepassword', token)
  });
};
