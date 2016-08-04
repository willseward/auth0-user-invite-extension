const joi = require('joi');

const inviteUser = (payload, callback) => {
  return callback(null, {});
};

const inviteUsers = (payload, callback) => {
  return callback(null, {});
};

const getInvitations = (payload, callback) => {
  const filter = payload.filter;
  if (!filter || ['invited', 'accepted'].indexOf(filter) != -1) {
    return callback(null, {});
  } else {
    return callback(new Error('Invalid filter'));
  }
};

module.exports = {
  inviteUser: inviteUser,
  inviteUsers: inviteUsers,
  getInvitations: getInvitations
};
