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
          "status": "pending" // default status
        }
      }
    };

    return req.auth0.users.create(options)
      .then(result => res.json(result))
      .catch(next);
  }
};

module.exports = {
  getUsers: getUsers,
  createUser: createUser
}
