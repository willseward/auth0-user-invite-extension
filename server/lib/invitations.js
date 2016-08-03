const Joi = require('joi');

const inviteUserSchema = Joi.object().keys({
  email: Joi.string().email().required()
});

const inviteUsersSchema = Joi.object().keys({
  csv: Joi.string().required()
});

const getInvitationsSchema = Joi.any().allow('invited', 'accepted');

const inviteUser = (payload, callback) => {
  Joi.validate(payload, inviteUserSchema, (err, value) => {
    if (err) {
      return callback(err);
    }
    // XXX
    return callback(null, {});
  });
};

const inviteUsers = (payload, callback) => {
  Joi.validate(payload, inviteUsersSchema, (err, value) => {
    if (err) {
      return callback(err);
    }
    // XXX
    return callback(null, {});
  });
};

const getInvitations = (payload, callback) => {
  const filter = payload.filter;
  if (!filter || ['invited', 'accepted'].indexOf(filter) != -1) {
    return callback(null, []);
  } else {
    return callback(new Error('Invalid filter'));
  }
};

module.exports = {
  inviteUser: inviteUser,
  inviteUsers: inviteUsers,
  getInvitations: getInvitations
};
