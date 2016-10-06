import uuid from 'uuid';
import async from 'async';
import moment from 'moment';

import config from './config';
import logger from './logger';
import Email from './email';
import getChangePassURL from './get-change-password-url';

let email = null;

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
    fields: 'user_id,name,email,identities.connection,app_metadata.invite.date_of_invitation',
    search_engine: 'v2'
  };

  options.auth0.users.getAll(auth0Options, function onGetUsers(err, result) {
    if (err) {
      logger.debug('Error getting users:', err);
      return callback(err);
    }
    const formattedUsers = result.users.map(item => {
      const date = item.app_metadata && item.app_metadata.invite.date_of_invitation;
      return {
        name: item.name,
        email: item.email,
        connection: item.identities && item.identities.length > 0 && item.identities[0].connection, // pick first one
        date_of_invitation: date ? moment(date).format('L') : ''
      };
    });
    return callback(null, { users: formattedUsers });
  });
}

/*
 * Add a new user.
 */

function onCreateUser(options, auth0Options, callback) {
  return options.auth0.users.create(auth0Options, (err, user) => {
    if (err) {
      logger.debug('Error creating user', err);
      return callback(err);
    }
    return callback(null, user);
  });
}

function onSendEmail(options, transportOptions, templateData, user, callback) {
  return email.sendEmail(transportOptions, templateData, (err, emailResult) => {
    if (err) {
      logger.debug('Error sending email', err);
      // delete last added user
      return options.auth0.users.delete({ id: user.user_id }, (err) => {
        if (err) {
          logger.debug('Error creating and deleting user', err);
          // NOTE: should we do something here too?
          return callback(err);
        }
        return callback({ message: 'Error sending email. Please confirm that you have set your configurations.' });
      });
    }

    return callback(null, emailResult);
  });
}

function createUser(options, callback) {
  const token = uuid.v4();
  const auth0Options = {
    connection: options.connection,
    email: options.email,
    password: uuid.v4(), // required field
    app_metadata: {
      invite: {
        status: 'pending', // default status
        token,
        date_of_invitation: moment().format()
      }
    }
  };

  // optional value that depends on connection
  if (options.username) {
    auth0Options.username = options.username;
  }

  const changePasswordURL = getChangePassURL(config('NODE_ENV'), options.host, token);
  const transportOptions = {
    to: auth0Options.email
  };
  const templateData = {
    name: 'Auth0 Customer',
    email: auth0Options.email,
    url: changePasswordURL
  };

  async.waterfall([
    async.apply(onCreateUser, options, auth0Options),
    async.apply(onSendEmail, options, transportOptions, templateData)
  ],
  (err, results) => {
    if (err) {
      logger.debug('Error creating user', err);
      return callback(err);
    }
    return callback(null, results);
  });
}

/*
 * Updates user "email_verified" field.
 */
const updateEmailVerified = (auth0, user, callback) => {
  return auth0.users.update({ id: user.user_id }, { email_verified: true },
    function (err, user) {
      if (err || !user) {
        logger.debug('There was a problem when updating the user email_verified field.', err);
        return callback(err);
      }
      return callback(null, user);
    });
}

const validateToken = (auth0, token, callback) => {
  const options = {
    sort: 'last_login:-1',
    q: `app_metadata.invite.token:${token}`,
    include_totals: false,
    fields: 'user_id,email,email_verified,app_metadata',
    search_engine: 'v2'
  };

  return auth0.users.get(options, function (err, users) {
    if (err || !users || !users.length || users.length !== 1) {
      logger.debug('Token is invalid or user was not found.');
      return callback({ message: err || 'Token is invalid or user was not found.' });
    }
    return callback(null, users[0]);
  });
}

/*
 * Validates user token.
 */
function validateUserToken(options, callback) {
  validateToken(options.auth0, options.token, function (err, user) {
    if (err || !user) {
      logger.debug('There was an error when validating the token.');
      return callback(err);
    }

    if (user.email_verified) {
      return callback(null, user);
    }

    updateEmailVerified(options.auth0, user, function (err, result) {
      if (err) {
        logger.debug('There was an error when updating field.');
        return callback(err);
      }
      return callback(null, result);
    });
  });
}

/*
 * Updates user with a new password. This also removes token and updates status.
 */
function savePassword(options, callback) {
  validateToken(options.auth0, options.token, function (err, user) {
    if (err || !user || user.user_id !== options.id) {
      logger.debug('There was an error when saving the user.');
      return callback(err);
    }

    return options.auth0.users.update(
      { id: options.id },
      {
        password: options.password,
        app_metadata: {
          invite: {
            status: 'accepted'
          }
        }
      }, function onUpdateUser(err, user) {
        if (err || !user) {
          logger.debug('There was an error when saving the user.');
          return callback(err);
        }
        return callback();
      });
  });
}

const configureEmail = (smtpConfig, templates) => {
  email = new Email(smtpConfig, templates);
};

module.exports = {
  getUsers,
  createUser,
  validateUserToken,
  savePassword,
  configureEmail
};
