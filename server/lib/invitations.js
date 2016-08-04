const csv = require('csv');
const each = require('each-async');
const Joi = require('joi');

const inviteUserSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  username: Joi.string()
});

const inviteUsersSchema = Joi.object().keys({
  csv: Joi.string().required()
});

const getInvitationsSchema = Joi.any().allow('invited', 'accepted');

function inviteUser(payload, callback) {
  Joi.validate(payload, inviteUserSchema, (err, value) => {
    if (err) {
      return callback(err);
    }
    return callback(null, {});
  });
}

function inviteUsers(payload, callback) {
  Joi.validate(payload, inviteUsersSchema, (err, value) => {
    if (err) {
      return callback(err);
    }
    csv.parse(payload.csv, function onParsed(err, records) {
      if (err) {
        return callback(err);
      }
      return each(records, (fields, index, done) => {
        inviteUser({ username: fields[0], email: fields[1] }, done);
      }, callback);
    })
  });
}

function getInvitations(payload, callback) {
  const filter = payload.filter;
  if (!filter || ['invited', 'accepted'].indexOf(filter) != -1) {
    // XXX
    return callback(null, []);
  } else {
    return callback(new Error('Invalid filter'));
  }
}

module.exports = {
  inviteUser: inviteUser,
  inviteUsers: inviteUsers,
  getInvitations: getInvitations
};
