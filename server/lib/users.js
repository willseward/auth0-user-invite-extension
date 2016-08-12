const uuid = require('uuid');
const csv = require('csv');
const each = require('each-async');
const Email = require('./email');

import _ from 'lodash';
import { Router as router } from 'express';
import { managementClient } from '../lib/middlewares';

var email = null;

/*
 * List all users.
 */
const getUsers = () => {
  return (req, res, next) => {
    const options = {
      sort: 'last_login:-1',
      q: `app_metadata.invite.status:${req.query.filter}`,
      per_page: req.query.per_page || 100,
      page: req.query.page || 0,
      include_totals: true,
      fields: 'user_id,name,email,app_metadata',
      search_engine: 'v2'
    };

    return req.auth0.users.getAll(options)
      .then(result => res.json({
        result,
        filter: req.query.filter
      }))
      .catch(next);
  }
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
    let transportOptions = {
      to: options.email
    };
    let templateData = {
      name: 'Auth0 Customer',
      token: token
    };

    let result = null;
    return req.auth0.users.create(options, function onCreateUser(err, user) {
      result = user;
      if (err) {
        return res.status(500).send({ error: (err.error) ? err.error : 'There was an error when creating the user.' });
      }
      email.sendEmail(transportOptions, templateData, function (err, emailResult) {
        if (err) {
          return res.status(500).send({ error: (err.error) ? err.error : 'There was an error when sending the email.' });
        }
        res.json(result);
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
        return res.json(user);
      });
    });
  }
};

/*
 * Updates user with a new password. This also removes token and updates status.
 */
const savePassword = () => {
  return (req, res, next) => {

    let id = req.body.user.id;
    let password = req.body.user.password;
    let token = req.body.user.token;

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
  getUsers,
  createUser,
  validateUserToken,
  savePassword,
  configureEmail
};
