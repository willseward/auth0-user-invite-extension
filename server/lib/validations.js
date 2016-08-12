const Joi = require('joi');

import users from './users';

const inviteUserSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  // username: Joi.string()
});

const inviteUsersSchema = Joi.object().keys({
  csv: Joi.string().required()
});

const getInvitationsSchema = Joi.object().keys({
  filter: Joi.string().valid('pending', 'accepted')
});

const getUserTokenSchema = Joi.object().keys({
  token: Joi.string().required()
});

const getSavePasswordSchema = Joi.object().keys({
  user: Joi.object().keys({
    id: Joi.string().required(),
    password: Joi.string().required(),
    token: Joi.string().required()
  })
});

function validateInviteUser(req, res, next) {

  if (!req.is('application/json')) {
    res.status(500).send({ error: 'Missing JSON information about user.' });
  }

  var payload = {
    email: req.body.user.email,
    // username: req.body.user.username
  }

  Joi.validate(payload, inviteUserSchema, (err, value) => {
    if (err) {
      res.status(500).send({ error: err });
    }

    next();
  });
}

function validateInvitations(req, res, next) {

  Joi.validate({ filter: req.query.filter }, getInvitationsSchema, (err, value) => {
    if (err) {
      res.status(500).send({ error: err, filter: req.query.filter });
    }

    next();
  });
}

function validateUserToken(req, res, next) {

  Joi.validate(req.query, getUserTokenSchema, (err, value) => {
    if (err) {
      res.status(500).send({ error: 'No token was provided.' });
    }

    next();
  });
}

function validateSavePassword(req, res, next) {

  Joi.validate(req.body, getSavePasswordSchema, (err, value) => {
    if (err) {
      res.status(500).send({ error: 'Missing information (user id, token or password).' });
    }

    next();
  });
}

module.exports = {
  validateInviteUser,
  validateInvitations,
  validateUserToken,
  validateSavePassword
};
