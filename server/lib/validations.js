const Joi = require('joi');

const inviteUserSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  username: Joi.string().allow('').optional()
});

const getInvitationsSchema = Joi.object().keys({
  filter: Joi.string().valid('pending', 'accepted')
});

const getUserTokenSchema = Joi.object().keys({
  token: Joi.string().required()
});

const getSavePasswordSchema = Joi.object().keys({
  id: Joi.string().required(),
  password: Joi.string().required(),
  token: Joi.string().required()
});

const templateConfigSchema = Joi.object().keys({
  from: Joi.string().email().required(),
  subject: Joi.string().required(),
  html: Joi.string().required()
});

const writeSMTPConfigSchema = Joi.object().keys({
  host: Joi.string().required(),
  port: Joi.number().required(),
  secure: Joi.boolean().required(),
  auth: Joi.object().keys({
    user: Joi.string().required(),
    pass: Joi.string().required()
  })
});

function getValidationError(message) {
  return {
    message
  };
}

function validateInviteUser(req, res, next) {

  if (!req.is('application/json')) {
    return res.status(500).send(getValidationError('Missing JSON information about user.'));
  }
  const payload = {
    email: req.body.user.email,
    username: req.body.user.username
  };

  Joi.validate(payload, inviteUserSchema, (err, value) => {
    if (err) {
      return res.status(500).send(getValidationError('Missing information (email or username).'));
    }

    next();
  });
}

function validateInvitations(req, res, next) {

  Joi.validate({ filter: req.query.filter }, getInvitationsSchema, (err, value) => {
    if (err) {
      return res.status(500).send({ ...getValidationError('Missing information (filter).'), filter: req.query.filter });
    }

    next();
  });
}

function validateUserToken(req, res, next) {

  Joi.validate(req.query, getUserTokenSchema, (err, value) => {
    if (err) {
      return res.status(500).send(getValidationError('No token was provided.'));
    }

    next();
  });
}

function validateSavePassword(req, res, next) {

  Joi.validate(req.body, getSavePasswordSchema, (err, value) => {
    if (err) {
      return res.status(500).send(getValidationError('Missing information (user id, token or password).'));
    }

    next();
  });
}

function validateWriteTemplateConfig(req, res, next) {

  Joi.validate(req.body, templateConfigSchema, (err, value) => {
    if (err) {
      return res.status(500).send(getValidationError('Missing information (from, subject or message).'));
    }

    next();
  });
}

function validateTemplateConfigSchema(configData, callback) {
  Joi.validate(configData, templateConfigSchema, (err, value) => {
    callback(err, value);
  });
}

module.exports = {
  validateInviteUser,
  validateInvitations,
  validateUserToken,
  validateSavePassword,
  validateWriteTemplateConfig,
  validateTemplateConfigSchema
};
