const uuid = require('uuid');
const csv = require('csv');
const each = require('each-async');

import _ from 'lodash';
import { Router as router } from 'express';
import { managementClient } from '../lib/middlewares';

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
  return (req, res, next) => {
    const options = {
      "connection": req.body.user.connection,
      "email": req.body.user.email,
      "password": uuid.v4(), // required field
      "app_metadata": {
        "invite": {
          "status": "pending", // default status
          "token": uuid.v4() // token that will be used to send invitation email
        }
      }
    };

    return req.auth0.users.create(options)
      .then(result => res.json(result))
      .catch(next);
  }
};

/*
 * Validates user token.
 */
const validateUserToken = () => {
  return (req, res, next) => {

    let token = req.query.token;

    const options = {
      sort: 'last_login:-1',
      q: `app_metadata.invite.token:${token}`,
      include_totals: false,
      fields: 'user_id,email,app_metadata',
      search_engine: 'v2'
    };

    return req.auth0.users.get(options)
      .then(result => {
        if (!result || !result.length || result.length !== 1) {
          return res.status(500).send({ error: 'Token is invalid or user was not found.' });
        }
        return res.json(result[0]);
      })
      .catch(next);
  }
};

/*
 * Updates user with a new password. This also removes token and updates status.
 */
const savePassword = () => {
  return (req, res, next) => {

    let id = req.body.user.id;
    let password = req.body.user.password;
    let token = req.body.user.token; // TODO: confirm if we need to use it again

    req.auth0.users.update(
      { id: id },
      {
        "password": password,
        // "email_verified": true,
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
  }
};

module.exports = {
  getUsers,
  createUser,
  validateUserToken,
  savePassword
}
