const uuid = require('uuid');
const csv = require('csv');
const each = require('each-async');
const Email = require('./email');
const getChangePassURL = require('./get-change-password-url');

import _ from 'lodash';
import { Router as router } from 'express';
import { managementClient } from '../lib/middlewares';
import config from './config';
import logger from './logger';

var email = null;

/*
 * List all users.
 */
function getUsers(options, callback) {
  const auth0Options = {
    sort: 'last_login:-1',
    q: `app_metadata.invite.status:${options.filter}`,
    per_page: options.perPage || 100,
    page: options.page || 0,
    include_totals: true,
    fields: 'user_id,name,email,app_metadata',
    search_engine: 'v2'
  };

  options.auth0.users.getAll(auth0Options, function onGetUsers(err, result) {
    if (err) {
      logger.debug('Error getting users:', err);
      return callback(err);
    }
    return callback(null, {
      result,
      filter: options.filter
    });
  });
};

/*
 * Add a new user.
 */
const createUser = () => {
  return (req, res) => {
    const token = uuid.v4();
    const options = {
      "connection": req.body.user.connection,
      "email": req.body.user.email,
      "password": uuid.v4(), // required field
      "app_metadata": {
        "invite": {
          "status": "pending", // default status
          "token": token
        }
      }
    };
    let changePasswordURL = getChangePassURL(config('NODE_ENV'), req.get('host'), token);
    let transportOptions = {
      to: options.email
    };
    let templateData = {
      name: 'Auth0 Customer',
      email: options.email,
      url: changePasswordURL
    };

    let result = null;
    return req.auth0.users.create(options, function onCreateUser(err, user) {
      result = user;
      if (err) {
        logger.debug('Error creating user', err);
        return res.status(500).send({ error: err ? err : 'There was an error when creating the user.' });
      }
      email.sendEmail(transportOptions, templateData, function (err, emailResult) {
        if (err) {
          logger.debug('Error sending email', err);
          return res.status(500).send({ error: err ? err : 'There was an error when sending the email.' });
        }
        return res.json(result);
      });
    });
  }
};

/*
 * Updates user "email_verified" field.
 */
const updateEmailVerified = (auth0, user, callback) => {

  return auth0.users.update(
    { id: user.user_id },
    {
      "email_verified": true
    })
    .then(user => {
      if (!user) {
        return callback({ error: 'There was a problem when updating the user email_verified field.' });
      }
      return callback(null, user);
    })
    .catch(callback);
}

const validateToken = (auth0, token, callback) => {

  const options = {
    sort: 'last_login:-1',
    q: `app_metadata.invite.token:${token}`,
    include_totals: false,
    fields: 'user_id,email,email_verified,app_metadata',
    search_engine: 'v2'
  };

  return auth0.users.get(options)
    .then(users => {
      if (!users || !users.length || users.length !== 1) {
        return callback({ error: 'Token is invalid or user was not found.' });
      }
      return callback(null, users[0]);
    })
    .catch(callback);
}

/*
 * Validates user token.
 */
const validateUserToken = () => {
  return (req, res, next) => {

    let token = req.query.token;

    validateToken(req.auth0, token, function(err, user) {

      if (err || !user) {
        return res.status(500).send({ error: (err.error) ? err.error : 'There was an error when validating the token.' });
      }

      if (user.email_verified) {
        return res.json(user);
      }

      updateEmailVerified(req.auth0, user, function(err, result) {
        if(err) {
          return res.status(500).send({ error: (err.error) ? err.error : 'There was an error when updating field.' });
        }
        return res.json(result);
      });
    });
  }
};

/*
 * Updates user with a new password. This also removes token and updates status.
 */
const savePassword = () => {
  return (req, res, next) => {

    let { id, password, token } = req.body;

    validateToken(req.auth0, token, function(err, user) {

      if (err || !user || user.user_id !== id) {
        return res.status(500).send({ error: (err.error) ? err.error : 'There was an error when saving the user.' });
      }

      return req.auth0.users.update(
        { id: id },
        {
          "password": password,
          "app_metadata": {
            "invite": {
              "status": "accepted"
            }
          }
        })
        .then(user => {
          if (!user) {
            return res.status(500).send({ error :'There was a problem when saving the user.' });
          }
          return res.sendStatus(200);
        })
        .catch(next);

    });

  }
};

const configureEmail = (emailTransport, templates) => {
  email = new Email(emailTransport, templates);
};

module.exports = {
  getUsers: getUsers,
  createUser,
  validateUserToken,
  savePassword,
  configureEmail
};
